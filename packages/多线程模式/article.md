# [引入故事，提出问题]

## 需求

开发引擎：
渲染包括8000个三角形的场景
每帧进行物理计算，更新每个三角形的位置



## 实现思路

使用ECS模式中的Manager层和Component+GameObject层来实现场景

因为引擎需要进行初始化、更新和渲染，所以使用管道模式，注册一个Pipeline管道模块，它包括Init Pipeline、Update Pipeline、Render Pipeline这三个管道。这三个管道分别有初始化、更新和渲染相关的Job


## 给出UML

TODO tu

WorldForNoWorker是门户，封装了API

PipeManager负责管理管道

NoWorkerPipeline是注册的管道模块

Init Pipeline是初始化管道，包括初始化相关的Job，用来实现初始化的逻辑

Update Pipeline是更新管道，包括更新相关的Job，用来实现更新的逻辑

Render Pipeline是渲染管道，包括渲染相关的Job，用来实现渲染的逻辑

Manager+Component+GameObject是ECS模式中的Manager层和Component+GameObject层，用来实现场景
场景中的一个三角形就是一个GameObject

一共有两种组件：TransformComponent、BasicMaterialComponent
前者负责三角形的位置、模型矩阵
后者负责三角形的材质数据，如颜色

GameObjectManager负责维护所有的gameObject的数据
TransformComponentManager负责维护和管理所有的TransformComponent组件的数据
BasicMaterialComponentManager负责维护和管理所有的BasicMaterialComponent组件的数据


Job调用了Manager+Component+GameObject来获得场景数据
WorldForNoWorker调用了Manager+Component+GameObject来创建场景





下图是流程图：
TODO tu

这里给出了初始化和主循环中的一帧的流程，它们都运行在主线程中


初始化运行了Init Pipeline管道，执行下面的Job逻辑：
首先创建并保存了WebGL上下文；
然后初始化VBO；
最后初始化材质


主循环的一帧中，首先运行了Update Pipeline管道，执行下面的Job逻辑：
首先进行物理计算，更新所有TransformComponent组件的位置；
最后更新所有TransformComponent组件的模型矩阵

然后运行了Render Pipeline管道，执行下面的Job逻辑：
首先发送相机数据；
最后渲染







## 给出代码


Client
```ts
let worldState = createState({ transformComponentCount: 8000, basicMaterialComponentCount: 8000 })

worldState = _createScene(worldState, 8000)

worldState = registerAllPipelines(worldState)

let canvas = document.querySelector("#canvas")

init(worldState, canvas).then(worldState => {
    _loop(worldState)
})
```

我们首先传入了最大的组件个数，创建了WorldState，用来保存所有的数据；
然后创建场景；
然后注册了所有的管道；
然后初始化；
最后主循环



首先，我们看下创建WorldState相关代码：
WorldForNoWorker
```ts
export let createState = ({ transformComponentCount, basicMaterialComponentCount }): state => {
    return {
        ecsData:
        {
            gameObjectManagerState: createGameObjectManagerState(),
            transformComponentManagerState: createTransformManagerState(transformComponentCount),
            basicMaterialComponentManagerState: createBasicMateiralManagerState(basicMaterialComponentCount)
        },
        pipelineState: createPipelineManagerState(),
    }
}
```

createState函数创建的WorldState保存了创建的各个Manager的state和PipelineManagerState


然后，我们看下创建场景相关代码：
Client
```ts
let _createTriangle = (worldState: worldState, color: Array<number>, position: Array<number>): worldState => {
    let triangleGameObjectData = createGameObject(worldState)
    worldState = triangleGameObjectData[0]
    let triangleGameObject = triangleGameObjectData[1]

    let transformComponentData = createTransformComponent(worldState)
    worldState = transformComponentData[0]
    let transformComponent = transformComponentData[1]
    let basicMateiralComponentData = createBasicMaterialComponent(worldState)
    let basicMaterialComponent = basicMateiralComponentData[1]
    worldState = basicMateiralComponentData[0]

    worldState = setTransformComponent(worldState, triangleGameObject, transformComponent)
    worldState = setBasicMaterialComponent(worldState, triangleGameObject, basicMaterialComponent)

    worldState = setPosition(worldState, transformComponent, position)
    worldState = setColor(worldState, basicMaterialComponent, color)

    return worldState
}

let _createScene = (worldState: worldState, count: number): worldState => {
    return range(0, count - 1).reduce(worldState => {
        return _createTriangle(worldState, [
            Math.random(), Math.random(), Math.random()
        ], [
            Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1
        ])
    }, worldState)
}

...

worldState = _createScene(worldState, 8000)
```

创建了包括8000个三角形的场景
每个三角形都是一个GameObject，它挂载了两个组件：TransformComponent、BasicMaterialComponent
每个三角形的位置、颜色都为随机值

因为这里使用了ECS模式，所以创建场景的实现代码跟ECS模式章节中的案例代码时一样的，故这里省略实现代码




然后，我们看下注册所有的管道相关代码：
WorldForNoWorker
```ts
export let registerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipeManagerState(state),
        getNoWorkerPipeline(),
        []
    )

    state = setPipeManagerState(state, pipelineManagerState)

    return state
}
```

这里注册了NoWorkerPipeline的Init Pipeline、Update Pipeline、Render Pipeline这三个管道

我们看下NoWorkerPipeline代码：
```ts
let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
        ...
	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
			return {
                ...
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "init",
                ...
			},
			{
				name: "update",
                ...
			},
			{
				name: "render",
                ...
			}
		],
	}
}
```

<!-- 这里注册了NoWorkerPipeline的Init Pipeline、Update Pipeline、Render Pipeline这三个管道 -->

我们看下Init Pipeline管道的各个Job代码：
CreateGLJob
```ts
export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let canvas: HTMLCanvasElement = globalThis.canvas

	return mostService.callFunc(() => {
		console.log("create gl job")

		let gl = canvas.getContext("webgl")

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				gl: gl
			})
		)
	})
}
```

该Job创建并保存了WebGL上下文

InitVBOJob
```ts
export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let state = getState(states)

	return mostService.callFunc(() => {
		console.log("init vbo job")

		let gl = getExnFromStrictNull(state.gl)

		let {
			verticesBuffer,
			indicesBuffer
		} = createVBOs(gl)

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...getState(states),
				vbo: {
					verticesVBO: verticesBuffer,
					indicesVBO: indicesBuffer
				}
			})
		)
	})
}
```

该Job初始化VBO

InitMaterialJob
```ts
export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("init material job");

        let gl = getExnFromStrictNull(state.gl)

        let program = createProgram(gl)

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...state,
                program: program
            })
        )
    })
}
```

该Job初始化材质
因为只有一种材质（BasicMaterialComponent），该材质只对应一个Shader，所以这里只创建了一个Program


我们看下Update Pipeline管道的各个Job代码：
ComputePhysicsAndUpdateJob
```ts
export let exec: execType<worldState> = (worldState, _) => {
    return mostService.callFunc(() => {
        console.log("compute physics job")

        //计算多个平均值，用它们更新所有TransformComponent组件的位置
        worldState = _updateAllTransformPositions(worldState, computeAveragePositions(worldState, getAllTransformComponents(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))))

        return worldState
    })
}
```
该Job进行物理计算，更新了所有TransformComponent组件的位置

UpdateTransformJob
```ts
export let exec: execType<worldState> = (worldState, _) => {
    return mostService.callFunc(() => {
        console.log("update transform job")

        //更新所有TransformComponent组件的模型矩阵
        let transformComponentManagerState = batchUpdate(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

        return {
            ...worldState,
            ecsData: {
                ...worldState.ecsData,
                transformComponentManagerState
            }
        }
    })
}
```

该Job更新了所有TransformComponent组件的模型矩阵


我们看下Render Pipeline管道的各个Job代码：
SendUniformShaderDataJob
```ts
export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let state = getState(states)

	return mostService.callFunc(() => {
		console.log("send uniform shader data job");

		let gl = getExnFromStrictNull(state.gl)

		let program = getExnFromStrictNull(state.program)

		//假的相机数据
		let viewMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])
		let pMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])

		sendCameraData(gl, viewMatrix, pMatrix, [program])

		return worldState;
	})
}
```

该Job发送了相机数据

RenderJob
```ts
export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("render job")

        let gl = getExnFromStrictNull(state.gl)

        clear(gl)

        //遍历场景中所有的gameObject
        getAllGameObjects(getExnFromStrictNull(worldState.ecsData.gameObjectManagerState)).forEach(gameObject => {
            //获得组件
            let material = getMaterialExn(getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState), gameObject)
            let transform = getTransformExn(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState), gameObject)

            //获得渲染的相关数据
            let [count, program, color, modelMatrix] = getRenderData(material, transform, getExnFromStrictNull(state.program), getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState), getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

            //渲染该gameObject
            render(gl, getExnFromStrictNull(state.vbo.verticesVBO), getExnFromStrictNull(state.vbo.indicesVBO), program, modelMatrix, color, count)
        })

        return worldState
    })
}
```

该Job渲染了所有的三角形



现在我们介绍完了注册所有的管道的相关代码，让我们继续看Client中初始化的相关代码：
WorldForNoWorker
```ts
export let init = (state: state, canvas): Promise<state> => {
    state = initPipelineManager(state, [
        unsafeGetPipeManagerState, setPipeManagerState
    ])

    globalThis.canvas = canvas

    return runPipeline(state, "init")
}
```

这里首先初始化了PipelineManager；
然后保存canvas到全局变量中，从而CreateGLJob能够获得它；
最后运行了Init Pipeline管道，执行其中的Job


现在，我们来看下Client中主循环相关代码
Client
```ts
let _loop = (worldState: worldState) => {
    update(worldState).then(worldState => {
        render(worldState).then(worldState => {
            console.log("after render")

            requestAnimationFrame(
                (time) => {
                    _loop(worldState)
                }
            )
        })
    })
}

init(worldState, canvas).then(worldState => {
    _loop(worldState)
})
```

主循环中进行了更新和渲染，我们看下相关代码
WorldForNoWorker
```ts
export let update = (state: state): Promise<state> => {
    return runPipeline(state, "update")
}

export let render = (state: state): Promise<state> => {
    return runPipeline(state, "render")
}
```

它们分别运行了对应的Update Pipeline、Render Pipeline管道，执行其中的Job



## 提出问题


- 性能差
因为场景中三角形过多，导致FPS较低



# [给出使用模式的改进方案]

## 概述解决方案

目前所有的逻辑都运行在主线程

因为现代CPU都是多核的，所以支持多个线程并行运行

可以再开一个渲染线程和一个物理线程，前者负责渲染，后者负责物理计算
让它们和主线程并行运行，从而提高FPS



## 给出UML？

TODO tu


总体来看，分为Main Worker、Physics Worker、Render Worker这三个部分

Main Worker包括了运行在主线程的模块，Physics Worker包括了运行在物理线程的模块，Render Worker包括了运行在渲染线程的模块

这三个部分的模块结构跟之前一样，都是有一个用户模块，它调用了一个门户模块；
门户模块调用一个PipelineManager模块来管理管道；
门户模块调用了Manager+Component+GameObject来创建场景；
门户模块包括一个管道模块；
管道模块包括几个管道，每个管道包括多个Job；
Job调用了Manager+Component+GameObject来获得场景数据




我们看下这三个部分对应的三个线程之间的数据传送：
主要有两种方式来实现数据传送：
- 拷贝
- 共享SharedArrayBuffer

这里介绍下共享SharedArrayBuffer：
两种组件的两个Buffer是SharedArrayBuffer，由主线程创建，并将其共享给渲染线程和物理线程，使他们能够从中读场景数据；
主线程创建了RenderWorkderData的Buffer，用来保存了场景中所有的transformComponent和basicMaterialComponent。主线程将其共享给渲染线程，使渲染线程能够获得它们，从而通过它们获得场景数据（如位置）；
主线程创建了PhysicsWorkderData的Buffer，用来保存了场景中所有的transformComponent的位置。主线程将其共享给物理线程，使物理线程能够将计算后的位置写进去


为什么物理线程不直接将计算后的位置写到共享的TransformComponent组件的Buffer中呢？
这就涉及到同步的问题，我们等下再来讨论







我们来看下流程图
<!-- ，图中的虚线是指线程之间在时间上的对应关系 -->

首先是初始化流程图：
TODO tu



这里并行运行了三个线程的Init Pipeline
具体的运行顺序如下；
1.主线程创建了渲染线程和物理线程的worker。创建后，这两个线程的Init Pipeline开始运行，等待主线程发送数据；
2.主线程开始三条并行的Job线：一条创建了RenderWorkderData的Buffer和PhysicsWorkerData的Buffer，发送了渲染数据和物理数据；另外两条等待渲染线程和物理线程发送结束初始化的标志
3.渲染线程在获得主线程发送的渲染数据后，开始初始化渲染，依次执行这些Job逻辑：初始化TransformComponent和BasicMaterialComponent、创建RenderWorkerData的Buffer的视图、创建WebGL上下文、初始化材质、发送结束初始化的标志
4.物理线程在获得主线程发送的物理数据后，开始初始化物理，依次执行这些Job逻辑：初始化TransformComponent和BasicMaterialComponent、创建PhysicsWorkerData的Buffer的视图、发送结束初始化的标志








然后来看下主循环的一帧流程图：
TODO tu

<!-- 图中的虚线是指线程之间在时间上的对应关系 -->


这里首先并行运行了主线程的Update Pipeline、渲染线程的Render Pipeline、物理线程的Update Pipeline；
然后运行了主线程的Sync Pipeline

具体的运行顺序如下；

1.主线程运行Update Pipeline，因为场景可能有变化，所以更新了RenderWorkderData的Buffer中的组件数据；
2.主线程发送开始主循环的标志，此时渲染线程和物理线程接收到了该标志，开始分别运行Render Pipeline和Update Pipeline。
其中物理线程在Update Pipeline中依次执行这些Job逻辑：物理计算、发送结束标志；
渲染线程在Render Pipeline中依次执行这些Job逻辑：获得主线程发送的渲染数据、发送相机数据、渲染、发送结束标志
3.主线程在发送开始主循环的标志后就结束了Update Pipeline，并运行Sync Pipeline，等待另外两个线程发送结束标志
4.主线程获得两个线程发送结束标志后，依次执行这些Job逻辑：使用物理线程中经过物理计算得到的值来更新所有TransformComponent组件的位置、更新所有TransformComponent组件的模型矩阵




这里回答之前提到的“同步”的问题：
因为主线程和物理线程的Update Pipeline是在同一时间并行运行的，如果物理线程在管道的物理计算的Job中将计算后的位置写到TransformComponent组件的Buffer，那么此后主线程从中读取位置时可能就获得修改后的值而不是原始值，从而造成冲突
所以首先物理线程的物理计算的Job将计算后的位置写到PhysicsWorkderData的Buffer中，然后在主线程的Sync Pipeline管道中再将其写到TransformComponent组件的Buffer中




值得注意的是，渲染线程和物理线程相比主线程是延迟了一帧的。
这是因为在主线程的Sync Pipeline中的“Update Transform”Job中会更新模型矩阵，而这更新后的值只能由下一帧的渲染线程和物理线程使用



## 结合UML图，描述如何具体地解决问题？

- 因为把渲染和物理计算的逻辑分别移到两个线程中，与主线程并行运行，从而提高了FPS



## 给出代码？


Client代码:
TODO continue


<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？
<!-- ## 概述抽象的解决方案 -->
## 补充说明
## 通用UML？
## 分析角色？
## 角色之间的关系？
## 角色的抽象代码？
## 遵循的设计原则在UML中的体现？




# 应用

## 优点

## 缺点

## 使用场景

### 场景描述

<!-- ### 解决方案 -->

### 具体案例

<!-- ## 实现该场景需要修改模式的哪些角色？ -->
<!-- ## 使用模式有什么好处？ -->

## 注意事项


# 扩展

more disscuss:

defer init material?
    shader index

defer dispose?


handle texture:
send image by transferFromImageBitmap





加载模型线程:
    ecs buffer->set copied gameObject, components data in load worker?




# 结合其它模式

## 结合哪些模式？
结合管道模式



结合ECS模式
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？
<!-- ## 哪些场景需要使用模式？ -->
## 给出具体的实践案例？



切换no worker, worker pipeline



# 更多资料推荐


游戏引擎一般都支持多线程


[JavaScript in parallel](https://50linesofco.de/post/2017-02-06-javascript-in-parallel-web-workers-transferables-and-sharedarraybuffer)
[WebGL Off the Main Thread](https://hacks.mozilla.org/2016/01/webgl-off-the-main-thread/)