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

WorldForNoWorker是引擎的门户，封装了引擎的API

PipeManager负责管理管道

NoWorkerPipeline是引擎注册的管道模块

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
首先进行物理计算，更新位置；
最后更新模型矩阵

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


TODO 总体来看，分为Render、针对每个运行环境的渲染、渲染的步骤这三个部分




TODO 延迟一帧

TODO 同步



## 结合UML图，描述如何具体地解决问题？
## 给出代码？



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