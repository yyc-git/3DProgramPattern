# [引入故事，提出问题]

## 需求


甲想要从0实现一个3D引擎


## 实现思路

<!-- 他首先实现了一个引擎的Demo，直接使用WebGL绘制出了一个最简单的场景 -->
他首先实现了一个引擎的Demo，直接使用WebGL绘制出了包括三个三角形的简单场景；
然后他从Demo中提炼出了引擎的最基本的框架，包括初始化、主循环的逻辑


## 给出UML

TODO tu


Engine是引擎的入口模块，提供API给Client

Director实现了初始化和主循环



## 给出代码


Client
```ts
DirectorAPI.init()
DirectorAPI.loop()
```

Engine
```ts
export let DirectorAPI = {
    init: init,
    loop: loop
}
```

Director
```ts
export let init = () => {
    console.log("初始化")
}

export let loop = () => {
    console.log("主循环")
}
```

下面，我们运行代码，运行结果如下：
```text
初始化
主循环
```


## 提出问题

甲发现一个人开发引擎的话花的时间太久了，于是找了另外三个开发者乙、丙、丁一起来开发




# [解决问题的方案，分析存在的问题]?


## 概述解决方案？

甲继续开发Director，完善初始化、主循环的逻辑；
乙负责实现实现一个数学库，实现矩阵计算之类的逻辑；
丙负责实现场景的管理；
丁负责实现渲染


## 给出UML？

TODO tu



<!-- Engine是引擎的入口模块，提供API给Client

Director实现了初始化和主循环 -->

我们介绍新加入的模块：

SceneManager负责场景的管理

Render负责渲染

Math负责数学计算


我们介绍下各个模块的依赖关系：

Engine依赖Director、SceneManager，封装它们来提供初始化、主循环和管理场景的API

Director依赖SceneManager、Render，通过它们来在初始化时初始化场景和初始化渲染，并在主循环时更新场景并渲染

Render依赖SceneManager，通过它获得场景数据

SceneManager、Render依赖Math，通过它进行数学计算


<!-- ## 结合UML图，描述如何具体地解决问题？ -->


## 给出代码？


Client代码:
```ts
let engineState = DirectorAPI.createState()

engineState = SceneAPI.createScene(engineState)

engineState = DirectorAPI.init(engineState)

DirectorAPI.loop(engineState)
```

我们首先创建了EngineState，用来保存引擎的所有数据；
然后创建了场景；
然后初始化；
最后主循环



现在我们首先来看下Engine代码：
```ts
export let DirectorAPI = {
    createState: createState,
    init: init,
    loop: loop
}

export let SceneAPI = {
    createScene: createScene
}
```

Engine负责封装API

我们看下Director的createState代码：
```ts
export let createState = (): engineState => {
    return {
        scene: createSceneManagerState()
    }
}
```

这里调用了SceneManager的createState函数来初始化场景数据，我们看下相关代码：
```ts
export let createState = (): sceneManagerState => {
    return { allGameObjects: [] }
}
```

场景数据是包括所有的gameObject的数组


我们继续来看下创建场景的相关代码：
SceneManager
```ts
export let createScene = (state: engineState) => {
    console.log("创建场景")

    //创建一个假的gameObject
    let sceneGameObject = 1

    return {
        ...state,
        scene: {
            ...state.scene,
            //通过concat而不是push来加入，保持state的immutable
            allGameObjects: state.scene.allGameObjects.concat([sceneGameObject])
        }
    }
}
```


我们继续来看下初始化的相关代码：
Director
```ts
export let init = (engineState) => {
    engineState = initScene(engineState)
    engineState = initRender(engineState)

    return engineState
}
```

这里调用了SceneManager来初始化场景，以及调用了Render来初始化渲染

我们看下相关代码
SceneManager
```ts
export let init = (state: engineState) => {
    console.log("初始化场景")

    return state
}
```
Render
```ts
export let init = (engineState: engineState) => {
    console.log("初始化渲染")

    return engineState
}
```


我们最后来看下主循环的相关代码：
Director
```ts
//假实现
let requestAnimationFrame = (func) => {
}

export let loop = (engineState: engineState) => {
    engineState = updateScene(engineState)
    engineState = render(engineState)

    requestAnimationFrame(
        (time) => {
            loop(engineState)
        }
    )
}
```

这里调用SceneManager来更新场景，并且调用了Render来渲染

我们看下更新场景的相关代码：
SceneManager
```ts
export let update = (state: engineState) => {
    console.log("更新场景")

    let _ = multiplyMatrix(1, 2)

    return state
}
```
Math
```ts
export let multiplyMatrix = (mat1, mat2) => {
    console.log("计算")

    return 1
}
```

这里调用了Math来计算


我们看下渲染的相关代码：
Render
```ts
export let render = (engineState: engineState) => {
    let allGameObjects = getAllGameObjects(engineState)

    console.log("处理场景数据")

    let _ = multiplyMatrix(1, 2)

    console.log("渲染")

    return engineState
}
```

这里调用了SceneManger来获得场景中所有的gameObjects，以及调用了Math来计算

SceneManger的相关代码：
```ts
export let getAllGameObjects = (state: engineState) => {
    return state.scene.allGameObjects
}
```



下面，我们运行代码，运行结果如下：
```text
创建场景
初始化场景
初始化渲染
更新场景
计算
处理场景数据
计算
渲染
```



## 提出问题

- 因为互相依赖导致开发效率的降低和沟通成本的增加

因为这四个人实现的功能点有互相依赖的关系，所以会出现下面的情况：
<!-- 合并代码时，出现大量冲突； -->
一个人修改了自己的代码，会影响到其他人的代码；
一个人可能需要修改别人负责的功能点代码，造成冲突。比如实现Render的丁可能会修改丙实现的SceneManager的代码，使其能提供某些特定的场景数据，结果在合并代码时发现SceneManager提供的是其它的数据


<!-- # [给出可能的改进方案，分析存在的问题]?



## 概述解决方案？
## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？


## 提出问题 -->


# [给出使用模式的改进方案]

## 概述解决方案


将每个模块作为独立的积木，定义该积木的协议，使得这样每个积木之间依赖的是抽象的积木协议而不是具体的积木实现


通过注册的方式来切换需要使用的积木


## 给出UML？

TODO tu

总体来看，分为BlockFacade、BlockManager、Engine Blocks三个部分，其中Engine Blocks包括各个积木实现和积木协议


<!-- BlockFacade封装了与积木相关的API，其中init函数注册了所有使用的积木，getEntryBlockProtocolName函数返回了入口积木的协议名 -->
BlockFacade封装了管理积木的API

BlockManager负责管理积木


我们来看下Engine Blocks：


之前的引擎模块都改为引擎的积木了，其中Engine改为Engine Block，Director改为Director Block，SceneManager改为SceneManager Block，Render改为Render Block，Math改为Math Block

我们这里将积木分为实现和协议两个部分，如Engine Block是积木实现，Engine Block Protocol是积木协议

积木实现是对积木协议的实现，积木协议定义了积木提供的服务和积木包括的数据的类型


各个积木实现之间没有直接依赖，而是依赖抽象的积木协议。如Engine Block没有依赖Director Block，而是依赖Directo Block Protocol这个积木协议


在所有的积木中，需要定义一个积木作为入口。
入口积木封装了调用其它积木的API，供Client调用

Engine Block就是入口积木，Client调用的方式如下：
首先Client调用BlockFacade的getEntryBlockProtocolName函数获得入口积木的协议名；
然后将其传给Client调用的BlockFacade的getBlockService函数后获得入口积木的服务，从而调用它的API





## 结合UML图，描述如何具体地解决问题？

- 因为不同积木之间通过积木协议进行了隔离，所以每个人只关注于开发自己负责的引擎积木，只要积木协议不修改就不会互相影响，从而提升了开发效率


## 给出代码？



Client代码:
```ts
let blockManagerState = init()

//传入的service为Engine Block Protocol定义的服务
let { director, scene } = getBlockService<service>(blockManagerState, getEntryBlockProtocolName())

blockManagerState = scene.createScene(blockManagerState)

blockManagerState = director.init(blockManagerState)

director.loop(blockManagerState)
```


我们首先调用BlockFacade的init函数进行积木的初始化；
然后调用BlockFacade的getEntryBlockProtocolName函数获得入口积木协议-Engine Block Protocol的协议名，将其传给BlockFacade的getBlockService函数后获得入口积木实现Engine Block的服务；
然后通过服务中的scene的createScene函数创建了场景；
然后通过服务中的director的init函数初始化；
最后通过服务中的director的loop函数主循环


现在我们首先来看下BlockFacade的init代码：
```ts
export let init = (): blockManagerState => {
    let blockManagerState = createState()

    blockManagerState = registerBlock(
        blockManagerState,
        "engine_block_protocol",
        getEngineBlockService,
        getDependentEngineBlockProtocolNameMap(),
        createEngineState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "director_block_protocol",
        getDirectorBlockService,
        getDependentDirectorBlockProtocolNameMap(),
        createDirectorState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "sceneManager_block_protocol",
        getSceneManagerBlockService,
        getDependentSceneManagerBlockProtocolNameMap(),
        createSceneManagerState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "render_block_protocol",
        getRenderBlockService,
        getDependentRenderBlockProtocolNameMap(),
        createRenderState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "math_block_protocol",
        getMathBlockService,
        getDependentMathBlockProtocolNameMap(),
        createMathState()
    )

    return blockManagerState
}
```

init函数首先创建了BlockManagerState，用来保存所有的积木数据；
最后注册了所有使用的积木，在注册积木时传入了积木协议名、获得积木的服务的函数、积木依赖的积木协议名、积木的state；


我们看下BlockManager相关代码：
```ts
export let createState = (): state => {
    return {
        blockServiceMap: Map(),
        blockStateMap: Map()
    }
}
```

createState函数返回了BlockManagerState，包括一个保存所有积木的服务的Hash Map和一个保存所有积木的state的Hash Map



我们继续看BlockManager相关代码：
```ts
export let getBlockServiceExn = <blockService>(state: state, blockProtocolName: blockProtocolName): blockService => {
    return getExnFromStrictUndefined(state.blockServiceMap.get(blockProtocolName))
}

export let getBlockStateExn = <blockState>(state: state, blockProtocolName: blockProtocolName): blockState => {
    return getExnFromStrictUndefined(state.blockStateMap.get(blockProtocolName))
}

export let setBlockState = <blockState>(state: state, blockProtocolName: blockProtocolName, blockState: blockState): state => {
    return {
        ...state,
        blockStateMap: state.blockStateMap.set(blockProtocolName, blockState)
    }
}

let _buildAPI = (): api => {
    return {
        getBlockService: getBlockServiceExn,
        getBlockState: getBlockStateExn,
        setBlockState: setBlockState,
    }
}

export let registerBlock = <blockService, dependentBlockProtocolNameMap, blockState>(state: state, blockProtocolName: blockProtocolName, getBlockService: getBlockService<dependentBlockProtocolNameMap, blockService>,
    dependentBlockProtocolNameMap: dependentBlockProtocolNameMap,
    blockState: blockState
): state => {
    state = {
        ...state,
        blockServiceMap: state.blockServiceMap.set(blockProtocolName, getBlockService(
            _buildAPI(),
            dependentBlockProtocolNameMap
        ))
    }

    state = setBlockState(state, blockProtocolName, blockState)

    return state
}
```

registerBlock函数实现了注册积木，它首先通过传入的getBlockService函数获得积木的服务，将其保存在blockServiceMap中；
最后将传入的积木的state保存在blockStateMap中

值得注意的是调用getBlockService函数时，注入了BlockManager的api和积木依赖的积木协议名，从而使得该积木能在它的服务中调用依赖的积木的服务和state


我们以Engine Block为例，来看下在注册该积木时传入的函数的相关代码：
Engine Block
```ts
//实现积木协议定义的服务
export let getBlockService: getBlockServiceBlockManager<
    //Engine Block->dependentBlockProtocolNameMap
	dependentBlockProtocolNameMap,
    //Engine Block Protocol->ServiceType->service
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
    //返回服务
	return {
		director: {
			init: (blockManagerState) => {
                ...
			},
			loop: (blockManagerState) => {
                ...
			}
		},
		scene: {
			createScene: (blockManagerState) => {
                ...
			}
		}
	}
}

//实现积木协议定义的state
export let createBlockState: createBlockStateBlockManager<
    //Engine Block Protocol->StateType->state
	engineState
> = () => {
    //返回state
	return null
}

//获得依赖的所有的积木协议名
export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"directorBlockProtocolName": "director_block_protocol",
		"sceneManagerBlockProtocolName": "sceneManager_block_protocol"
	}
}
```

Engine Block的三个函数使用了BlockManager定义的类型，我们看下相关代码：
BlockManagerType
```ts
export type getBlockService<dependentBlockProtocolNameMap, blockService> = (_2: api, dependentBlockProtocolNameMap: dependentBlockProtocolNameMap) => blockService;

export type createBlockState<blockState> = () => blockState;

export type getDependentBlockProtocolNameMap = () => any
```

getBlockService类型接收的第一个泛型参数来自Engine Block定义的DependentMapType，代码如下
DependentMapType
```ts
export type dependentBlockProtocolNameMap = {
    directorBlockProtocolName: string,
    sceneManagerBlockProtocolName: string
}
```


我们看下相关的Engine Block Protocol代码：
Engine Block Protocol->ServiceType
```ts
type directorAPI = {
	init: (blockManagerState: blockManagerState) => blockManagerState,
	loop: (blockManagerState: blockManagerState) => void,
}

type sceneAPI = {
	createScene: (blockManagerState) => blockManagerState,
}

export type service = {
	director: directorAPI
	scene: sceneAPI
}
```
Engine Block Protocol->StateType
```ts
export type state = null
```


我们现在回到Client，看下它获得入口积木的服务的相关代码：
Client
```ts
//传入的service为Engine Block Protocol定义的服务
let { director, scene } = getBlockService<service>(blockManagerState, getEntryBlockProtocolName())
```
BlockFacade
```ts
export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolNameProtocolName) => {
    //调用BlockManager->getBlockService
    return getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}

...

//获得Engine Block Protocol的协议名
export let getEntryBlockProtocolName = () => "engine_block_protocol"
```


我们继续看Client中创建场景的相关代码：
Client
```ts
blockManagerState = scene.createScene(blockManagerState)
```

这里调用了Engine Block的服务的init->createScene函数，我们看下相关代码：
Engine Block
```ts
//实现积木协议定义的服务
export let getBlockService: getBlockServiceBlockManager<
    //Engine Block->dependentBlockProtocolNameMap
	dependentBlockProtocolNameMap,
    //Engine Block Protocol->ServiceType->service
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
    //返回服务
	return {
        ...
		scene: {
			createScene: (blockManagerState) => {
				//通过SceneManager Block Protocol接口来调用SceneManager Block的服务的createScene函数
				let { createScene } = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

				//因为createScene函数返回了新的SceneManager Block的state，所以调用BlockManager的api的setBlockState将其保存到BlockManagerState中，并返回新的BlockManagerState
				return api.setBlockState<sceneManagerState>(
					blockManagerState,
					sceneManagerBlockProtocolName,
					createScene(api.getBlockState<sceneManagerState>(blockManagerState, sceneManagerBlockProtocolName))
				)
			}
		}
	}
}
```

createScene函数通过SceneManager Block Protocol接口来调用SceneManager Block的服务，只要这个积木的协议不变，那么不管这个积木的实现-SceneManager Block如何改变，都不会影响到Engine Block

SceneManager Block相关代码如下：
SceneManager Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	sceneManagerService
> = (api, { mathBlockProtocolName }) => {
	return {
		createScene: (sceneManagerState) => {
			console.log("创建场景")

			let sceneGameObject = 1

			return {
				...sceneManagerState,
				allGameObjects: sceneManagerState.allGameObjects.concat([sceneGameObject])
			}
		},
        ...
	}
}

export let createBlockState: createBlockStateBlockManager<
	sceneManagerState
> = () => {
	return {
		allGameObjects: []
	}
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"mathBlockProtocolName": "math_block_protocol"
	}
}
```
SceneManager Block Protocol->ServiceType
```ts
export type service = {
	createScene: (sceneManagerState) => sceneManagerState,
    ...
}
```
SceneManager Block Protocol->StateType
```ts
type gameObject = any

export type allGameObjects = Array<gameObject>

export type state = {
    allGameObjects: allGameObjects
}
```


我们继续看Client中初始化的相关代码：
Client
```ts
blockManagerState = director.init(blockManagerState)
```

这里调用了Engine Block的服务的director->init函数，我们看下相关代码：
Engine Block
```ts
//实现积木协议定义的服务
export let getBlockService: getBlockServiceBlockManager<
    //Engine Block->dependentBlockProtocolNameMap
	dependentBlockProtocolNameMap,
    //Engine Block Protocol->ServiceType->service
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
    //返回服务
	return {
		director: {
			init: (blockManagerState) => {
				//通过Director Block Protocol接口来调用Director Block的服务的init函数
				let { init } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return init(blockManagerState)
			},
            ...
	}
}
```

依赖的积木相关代码如下：
Director Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	directorService
> = (api, { sceneManagerBlockProtocolName, renderBlockProtocolName }) => {
	return {
		init: (blockManagerState) => {
			//通过SceneManager Block Protocol接口来调用SceneManager Block的服务的init函数
			let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			blockManagerState = sceneManagerService.init(blockManagerState)

			//通过Render Block Protocol接口来调用Render Block的服务的init函数
			let renderService = api.getBlockService<renderService>(blockManagerState, renderBlockProtocolName)

			blockManagerState = renderService.init(blockManagerState)

			return blockManagerState
		},
        ...
    }
}

export let createBlockState: createBlockStateBlockManager<
	renderState
> = () => {
	return null
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"sceneManagerBlockProtocolName": "sceneManager_block_protocol",
		"renderBlockProtocolName": "render_block_protocol"
	}
}
```
Director Block Protocol->ServiceType
```ts
export type service = {
	init: (blockManagerState: blockManagerState) => blockManagerState,
	...
}
```
Director Block Protocol->StateType
```ts
export type state = null
```

Director Block依赖了SceneManager Block Protocol、Render Block Protocol，相关代码为：
SceneManager Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	sceneManagerService
> = (api, { mathBlockProtocolName }) => {
	return {
        ...
		init: (blockManagerState) => {
			console.log("初始化场景")

			return blockManagerState
		},
        ...
	}
}
```
SceneManager Block Protocol->ServiceType
```ts
export type service = {
    ...
	init: (blockManagerState: blockManagerState) => blockManagerState,
    ...
}
```
Render Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	renderService
> = (api, { sceneManagerBlockProtocolName, mathBlockProtocolName }) => {
	return {
		init: (blockManagerState) => {
			console.log("初始化渲染")

			return blockManagerState
		},
        ...
    }
}
```
Render Block Protocol->ServiceType
```ts
export type service = {
	init: (blockManagerState: blockManagerState) => blockManagerState,
    ...
}
```


我们继续看Client中主循环的相关代码：
Client
```ts
director.loop(blockManagerState)
```

这里调用了Engine Block的服务的director->loop函数，我们看下相关代码：
Engine Block
```ts
//实现积木协议定义的服务
export let getBlockService: getBlockServiceBlockManager<
    //Engine Block->dependentBlockProtocolNameMap
	dependentBlockProtocolNameMap,
    //Engine Block Protocol->ServiceType->service
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
    //返回服务
	return {
		director: {
            ...
			loop: (blockManagerState) => {
				//通过Director Block Protocol接口来调用Director Block的服务的loop函数
				let { loop } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return loop(blockManagerState)
			}
        }
	}
}
```

依赖的积木相关代码如下：
Director Block
```ts
//假实现
let requestAnimationFrame = (func) => {
}

let _loop = (api: api, blockManagerState: blockManagerState, sceneManagerBlockProtocolName: blockProtocolName, renderBlockProtocolName: blockProtocolName) => {
	//通过SceneManager Block Protocol接口来调用SceneManager Block的服务的update函数
	let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

	blockManagerState = sceneManagerService.update(blockManagerState)

	//通过Render Block Protocol接口来调用Render Block的服务的render函数
	let renderService = api.getBlockService<renderService>(blockManagerState, renderBlockProtocolName)

	blockManagerState = renderService.render(blockManagerState)

	requestAnimationFrame(
		(time) => {
			_loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
		}
	)
}

export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	directorService
> = (api, { sceneManagerBlockProtocolName, renderBlockProtocolName }) => {
	return {
        ...
		loop: (blockManagerState) => {
			_loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
		},
	}
}
```
Director Block Protocol->ServiceType
```ts
export type service = {
	...
	loop: (blockManagerState: blockManagerState) => void,
}
```

Director Block依赖了SceneManager Block Protocol、Render Block Protocol，相关代码为：
SceneManager Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	sceneManagerService
> = (api, { mathBlockProtocolName }) => {
	return {
        ...
		getAllGameObjects: (sceneManagerState) => {
			return sceneManagerState.allGameObjects
		},
        ...
		update: (blockManagerState) => {
			console.log("更新场景")

			//通过Math Block Protocol接口来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			return blockManagerState
		}
	}
}
```
SceneManager Block Protocol->ServiceType
```ts
export type service = {
    ...
	getAllGameObjects: (sceneManagerState) => allGameObjects,
	...
	update: (blockManagerState: blockManagerState) => blockManagerState,
    ...
}
```
Render Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	renderService
> = (api, { sceneManagerBlockProtocolName, mathBlockProtocolName }) => {
	return {
        ...
		render: (blockManagerState) => {
			//通过SceneManager Block Protocol接口来调用SceneManager Block的服务的getAllGameObjects函数
			let { getAllGameObjects } = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			let allGameObjects = getAllGameObjects(api.getBlockState<sceneManagerState>(blockManagerState, sceneManagerBlockProtocolName))

			console.log("处理场景数据")

			//通过Math Block Protocol接口来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			console.log("渲染")

			return blockManagerState
		}
	}
}
```

SceneManager Block和Render Block依赖了Math Block Protocol，相关代码为：
Math Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	mathService
> = (api, _) => {
	return {
		multiplyMatrix: (mat1, mat2) => {
			console.log("计算")

			return 1
		}
	}
}

export let createBlockState: createBlockStateBlockManager<
	mathState
> = () => {
	return null
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
    //没有依赖的积木
	return {
	}
}
```
Math Block Protocol->ServiceType
```ts
type matrix = any

export type service = {
	multiplyMatrix: (mat1: matrix, mat2: matrix) => matrix,
}
```
Math Block Protocol->StateType
```ts
export type state = null
```


下面，我们运行代码，运行结果如下：
```text
创建场景
初始化场景
初始化渲染
更新场景
计算
处理场景数据
计算
渲染
```

运行结果跟之前一样





<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？

TODO continue

<!-- ## 概述抽象的解决方案 -->
## 补充说明
## 通用UML？
## 分析角色？
## 角色之间的关系？
## 角色的抽象代码？
## 遵循的设计原则在UML中的体现？




# 应用

## 优点
能通过增加引擎的开发人员来实现加快引擎的开发进度？

2.如何将引擎模块化，使得引擎只包含Client需要的引擎模块，去除其它的引擎模块，从而减少引擎的文件大小

## 缺点

## 使用场景

### 场景描述

<!-- ### 解决方案 -->

### 具体案例

<!-- ## 实现该场景需要修改模式的哪些角色？ -->
<!-- ## 使用模式有什么好处？ -->

## 注意事项


# 扩展


# 结合其它模式

## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？
<!-- ## 哪些场景需要使用模式？ -->
## 给出具体的实践案例？



# 更多资料推荐
