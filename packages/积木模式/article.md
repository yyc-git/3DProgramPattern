# [引入故事，提出问题]

## 需求


甲想要从0开发一个引擎


## 实现思路

他首先实现了一个引擎的Demo，直接使用WebGL绘制出了一个最简单的场景
<!-- 他首先实现了一个引擎的Demo，直接使用WebGL绘制出了包括三个三角形的简单场景； -->
然后他从Demo中提炼出了引擎的最基本的框架，包括初始化、主循环的逻辑


下面来看下他提出的基本框架：

## 给出UML

TODO tu


Engine是引擎的入口模块，提供API给Client

Director负责初始化和主循环



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

甲发现一个人开发引擎花的时间太久了，于是找了另外三个开发者乙、丙、丁一起来开发




# [解决问题的方案，分析存在的问题]?


## 概述解决方案？

他们的分工如下：
甲继续开发Director，完善初始化、主循环的逻辑；
乙负责实现实现一个数学库，实现矩阵计算之类的逻辑；
丙负责实现场景的管理；
丁负责实现渲染


## 给出UML？

TODO tu



<!-- Engine是引擎的入口模块，提供API给Client

Director实现了初始化和主循环 -->

我们介绍新加入的模块，他们由分别由一个新的开发者负责开发：

SceneManager负责场景的管理

Render负责渲染

Math负责数学计算


我们介绍下各个模块的依赖关系：

Engine依赖Director、SceneManager，封装它们来提供初始化、主循环和管理场景的API

Director依赖SceneManager、Render，在初始化时通过它们初始化场景和初始化渲染，在主循环时通过它们更新场景和渲染

Render依赖SceneManager，在渲染时通过它获得场景数据

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
初始化的值为空数组，表示场景中目前没有gameObject


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

这里创建了一个gameObject，并将其加入到场景数据的allGameObjects数组中

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

这里调用SceneManager来更新场景，以及调用了Render来渲染

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

这里SceneManager调用了Math来计算


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
SceneManager
```ts
export let getAllGameObjects = (state: engineState) => {
    return state.scene.allGameObjects
}
```

这里Render调用了SceneManger来获得场景中所有的gameObjects，以及调用了Math来计算


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

- 模块之间互相依赖，导致团队开发效率的降低和沟通成本的增加

因为这四个开发者实现的模块有互相依赖的关系，所以会出现下面的情况：
开发者合并自己的代码时，容易出现大量冲突；
一个开发者修改了自己的代码，会影响到其他开发者的代码；
一个开发者可能需要修改别的开发者负责的模块代码，造成冲突。比如实现Render的丁可能会修改丙实现的SceneManager的代码，使其能提供某些特定的场景数据，结果在合并代码时发现SceneManager提供的是其它的数据


<!-- # [给出可能的改进方案，分析存在的问题]?



## 概述解决方案？
## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？


## 提出问题 -->


# [给出使用模式的改进方案]

## 概述解决方案

通过下面的改进来降低模块之间的依赖：
将每个模块改为一个独立的积木
积木包括积木实现和积木协议两个部分，其中积木实现是对积木协议的实现
积木协议定义了积木提供的服务和积木包括的数据的类型，其中“服务”就是多个函数，用于实现积木的逻辑；数据是一个state，该state保存了积木的所有数据
每个积木之间依赖的是抽象的积木协议而不是具体的积木实现
大家首先一起定义好各个积木的协议，然后每个开发者只独立开发自己的积木实现，互相之间通过积木协议交互



## 给出UML？

TODO tu

总体来看，分为BlockFacade、BlockManager、Engine Blocks三个部分，其中Engine Blocks包括各个积木的积木实现和积木协议

我们看下BlockFacade、BlockManager这两个部分：

BlockFacade封装了管理积木的API，它的init函数负责注册所有使用的积木

BlockManager负责实现管理积木




我们看下Engine Blocks这个部分：

引擎完全由积木组成
之前的各个引擎模块都对应地改为积木了，其中Engine改为Engine Block，Director改为Director Block，SceneManager改为SceneManager Block，Render改为Render Block，Math改为Math Block

我们这里将积木分为实现和协议两个部分，如Engine Block是积木实现，Engine Block Protocol是积木协议。Engine Block实现了Engine Block Protocol


各个积木实现之间没有直接依赖，而是依赖抽象的积木协议。如Engine Block没有依赖Director Block，而是依赖Directo Block Protocol这个积木协议


在所有的积木中，需要定义一个积木作为入口。
入口积木封装了调用其它积木的API，供Client调用

Engine Block就是入口积木，Client调用它的方式如下：
首先Client调用BlockFacade的getEntryBlockProtocolName函数获得入口积木的协议名；
然后将其传给BlockFacade的getBlockService函数，从而获得并使用入口积木的服务





## 结合UML图，描述如何具体地解决问题？

- 因为不同积木之间通过积木协议进行了隔离，所以每个开发者只关注于开发自己负责的积木，只要积木协议不修改，就不会互相影响，从而提升了团队的开发效率，降低了团队的沟通成本


## 给出代码？



Client代码:
```ts
let blockManagerState = init()

//获得了入口积木-Engine Block的服务
let { director, scene } = getBlockService<service>(blockManagerState, getEntryBlockProtocolName())

blockManagerState = scene.createScene(blockManagerState)

blockManagerState = director.init(blockManagerState)

director.loop(blockManagerState)
```


我们首先调用BlockFacade的init函数进行积木的初始化；
然后调用BlockFacade的getEntryBlockProtocolName函数获得入口积木协议-Engine Block Protocol的协议名，将其传给BlockFacade的getBlockService函数后获得入口积木Engine Block的服务；
然后通过服务的scene的createScene函数创建了场景；
然后通过服务的director的init函数初始化；
最后通过服务的director的loop函数主循环


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

init函数首先调用BlockManager的createState函数创建了BlockManagerState，用来保存所有的积木数据；
最后调用BlockManager的registerBlock函数注册了所有使用的积木，在注册积木时传入了积木协议名、获得积木的服务的函数、积木依赖的所有积木协议名、积木的state；


我们看下BlockManager的createState代码：
```ts
export let createState = (): state => {
    return {
        blockServiceMap: Map(),
        blockStateMap: Map()
    }
}
```

createState函数返回了BlockManagerState，包括一个保存所有积木的服务的Hash Map和一个保存所有积木的state的Hash Map，它们的Key是积木协议名，Value分别是积木服务和积木state



我们看下BlockManager的registerBlock相关代码：
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

值得注意的是在调用getBlockService函数时，注入了BlockManager的api和积木依赖的所有积木协议名，从而使得该积木能在它的服务中调用依赖的其它积木的服务和state


我们以Engine Block为例，来看下在注册该积木时调用该积木实现的三个函数的相关代码：
Engine Block
```ts
//实现积木协议定义的服务
export let getBlockService: getBlockServiceBlockManager<
    //该类型定义在Engine Block->DependentBlockProtocolNameMap
	dependentBlockProtocolNameMap,
    //该类型是Engine Block Protocol->ServiceType->service
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
    //该类型是Engine Block Protocol->StateType->state
	engineState
> = () => {
    //返回state，该state为空
	return null
}

//获得依赖的所有积木协议名
export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"directorBlockProtocolName": "director_block_protocol",
		"sceneManagerBlockProtocolName": "sceneManager_block_protocol"
	}
}
```

这三个函数使用了BlockManager定义的类型，我们看下相关代码：
BlockManagerType
```ts
export type getBlockService<dependentBlockProtocolNameMap, blockService> = (_2: api, dependentBlockProtocolNameMap: dependentBlockProtocolNameMap) => blockService;

export type createBlockState<blockState> = () => blockState;

export type getDependentBlockProtocolNameMap = () => any
```

getBlockService类型接收的第一个泛型参数来自Engine Block定义的DependentMapType，代码如下：
DependentMapType
```ts
export type dependentBlockProtocolNameMap = {
    directorBlockProtocolName: string,
    sceneManagerBlockProtocolName: string
}
```

我们看下Engine Block Protocol代码：
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


看完了Client调用的BlockFacade的init函数的相关代码后，我们继续看Client获得入口积木的服务的相关代码：
Client
```ts
//获得了入口积木-Engine Block的服务
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

这里调用了Engine Block的服务的scene的createScene函数，我们看下相关代码：
Engine Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
	return {
        ...
		scene: {
			createScene: (blockManagerState) => {
				//通过SceneManager Block Protocol来调用SceneManager Block的服务的createScene函数
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

Engine Block的createScene函数依赖SceneManager Block Protocol，只要这个积木的协议不变，那么不管这个积木的实现-SceneManager Block如何改变，都不会影响到Engine Block

我们看下SceneManager Block相关代码：
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


我们回到Client，继续看Client中初始化的相关代码：
Client
```ts
blockManagerState = director.init(blockManagerState)
```

这里调用了Engine Block的服务的director的init函数，我们看下相关代码：
Engine Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
	return {
		director: {
			init: (blockManagerState) => {
				//通过Director Block Protocol来调用Director Block的服务的init函数
				let { init } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return init(blockManagerState)
			},
            ...
	}
}
```

这里依赖了Director Block Protocol，相关代码如下：
Director Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	directorService
> = (api, { sceneManagerBlockProtocolName, renderBlockProtocolName }) => {
	return {
		init: (blockManagerState) => {
			//通过SceneManager Block Protocol来调用SceneManager Block的服务的init函数
			let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			blockManagerState = sceneManagerService.init(blockManagerState)

			//通过Render Block Protocol来调用Render Block的服务的init函数
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

Director Block依赖了SceneManager Block Protocol、Render Block Protocol，相关代码如下：
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


我们回到Client，继续看Client中主循环的相关代码：
Client
```ts
director.loop(blockManagerState)
```

这里调用了Engine Block的服务的director的loop函数，我们看下相关代码：
Engine Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	engineService
> = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
	return {
		director: {
            ...
			loop: (blockManagerState) => {
				//通过Director Block Protocol来调用Director Block的服务的loop函数
				let { loop } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return loop(blockManagerState)
			}
        }
	}
}
```

这里依赖了Director Block Protocol，相关代码如下：
Director Block
```ts
//假实现
let requestAnimationFrame = (func) => {
}

let _loop = (api: api, blockManagerState: blockManagerState, sceneManagerBlockProtocolName: blockProtocolName, renderBlockProtocolName: blockProtocolName) => {
	//通过SceneManager Block Protocol来调用SceneManager Block的服务的update函数
	let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

	blockManagerState = sceneManagerService.update(blockManagerState)

	//通过Render Block Protocol来调用Render Block的服务的render函数
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

Director Block依赖了SceneManager Block Protocol、Render Block Protocol，相关代码如下：
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

			//通过Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			return blockManagerState
		}
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
			//通过SceneManager Block Protocol来调用SceneManager Block的服务的getAllGameObjects函数
			let { getAllGameObjects } = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			let allGameObjects = getAllGameObjects(api.getBlockState<sceneManagerState>(blockManagerState, sceneManagerBlockProtocolName))

			console.log("处理场景数据")

			//通过Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			console.log("渲染")

			return blockManagerState
		}
	}
}
```

SceneManager Block和Render Block依赖了Math Block Protocol，相关代码如下：
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
    //没有依赖
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

<!-- 通过搭建不同的积木来组装系统 -->
系统由积木搭建而成



## 补充说明


将系统的每个模块离散化为一个个独立的积木

积木之间依赖于协议而不是实现


## 通用UML？
TODO tu

## 分析角色？


我们来看看模式的相关角色：


总体来看，分为BlockFacade、BlockManager、System Blocks三个部分，其中System Blocks包括各个积木的积木实现和积木协议

整个系统由Block组成

- BlockFacade
该角色封装了管理积木的API，它的init函数负责注册所有使用的积木

- BlockManager
该角色负责实现管理积木

- Entry Block Protocol
该角色为入口积木的协议

- Entry Block
该角色为入口积木的实现

- Block Protocol
该角色为其它积木的协议

- Block
该角色为其它积木的实现


## 角色之间的关系？

- System Blocks中有一个入口积木

- 入口积木可以依赖其它积木，其它积木不能依赖入口积木

- 一个积木实现实现了一个积木协议

- 一个积木实现可以通过多个积木协议调用它们的服务、state




## 角色的抽象代码？

下面我们来看看各个角色的抽象代码：
- Client的抽象代码
```ts
let blockManagerState = init()

let entryBlockService = getBlockService<service>(blockManagerState, getEntryBlockProtocolName())

调用entryBlockService...
```

- BlockFacade的抽象代码
```ts
export let init = (): blockManagerState => {
    let blockManagerState = createState()

    blockManagerState = registerBlock(
        blockManagerState,
        "entry_block_protocol",
        getEntryBlockService,
        getDependentEntryBlockProtocolNameMap(),
        createEntryBlockState()
    )

    blockManagerState = registerBlock(
        blockManagerState,
        "block1_protocol",
        getBlock1Service,
        getDependentBlock1ProtocolNameMap(),
        createBlock1State()
    )
    注册更多的Block...

    return blockManagerState
}


export let getEntryBlockProtocolName = () => "entry_block_protocol"

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
```

- BlockManager的抽象代码
BlockManagerType
```ts
export type blockName = string

export type blockProtocolName = string

export type blockService = any

export type blockState = any

export type dependentBlockProtocolNameMap = any

export type state = {
  blockServiceMap: Map<blockProtocolName, blockService>,
  blockStateMap: Map<blockProtocolName, blockState>
}

export type api = {
  getBlockService<blockService>(state: state, blockProtocolName: blockProtocolName): blockService,
  getBlockState<blockState>(state: state, blockProtocolName: blockProtocolName): blockState,
  setBlockState<blockState>(state: state, blockProtocolName: blockProtocolName, blockState: blockState): state
};

export type getBlockService<dependentBlockProtocolNameMap, blockService> = (_1: api, dependentBlockProtocolNameMap: dependentBlockProtocolNameMap) => blockService;

export type createBlockState<blockState> = () => blockState;

export type getDependentBlockProtocolNameMap = () => any
```
BlockManager
```ts
export declare function createState(): state

export declare function getBlockServiceExn<blockService>(state: state, blockProtocolName: blockProtocolName): blockService

export declare function getBlockStateExn<blockState>(state: state, blockProtocolName: blockProtocolName): blockState

export declare function setBlockState<blockState>(state: state, blockProtocolName: blockProtocolName, blockState: blockState): state

export declare function registerBlock<blockService, dependentBlockProtocolNameMap, blockState>(state: state, blockProtocolName: blockProtocolName, getBlockService: getBlockService<dependentBlockProtocolNameMap, blockService>,
    dependentBlockProtocolNameMap: dependentBlockProtocolNameMap,
    blockState: blockState
): state
```
- Entry Block Protocol的抽象代码
ServiceType
```ts
export type service = {
	...
}
```
StateType
```ts
//如果为空则为null
export type state = {
    ...
}
```
- Entry Block的抽象代码
DependentMapType
```ts
export type dependentBlockProtocolNameMap = {
    block1ProtocolName: string,
    block2ProtocolName: string,
    ...
}
```
Entry Block
```ts
export let getBlockService: getBlockServiceBlockManager<
	dependentBlockProtocolNameMap,
	service
> = (api, { block1ProtocolName, block2ProtocolName, ... }) => {
	return {
		实现service...
	}
}

export let createBlockState: createBlockStateBlockManager<
	state
> = () => {
	return 创建state...
}

export let getDependentBlockProtocolNameMap: getDependentBlockProtocolNameMapBlockManager = () => {
	return {
		"block1ProtocolName": "block1 protocol's package.json's name",
		"block2ProtocolName": "block2 protocol's package.json's name",
		...
	}
}
```
- Block Protocol的抽象代码
跟Entry Block Protocl的抽象代码一样
- Block的抽象代码
跟Entry Block的抽象代码一样




## 遵循的设计原则在UML中的体现？

TODO finish



# 应用

## 优点

- 支持大型的开发团队
因为每个开发者只独立地负责自己的积木，互相之间通过积木协议交互，所以只要积木协议设计得足够抽象而使未来的改动较少，则可以显著降低各个开发者之间的影响，从而能够支持更多的开发者同时开发系统

- 可以按需打包需要的积木到build后的系统文件中，从而减小文件大小
具体操作是使BlockFacade只注册需要的积木

- 测试方便

对于单元测试：
因为各个积木实现之间没有耦合，所以可以单独地对每个积木实现进行单元测试；
对于调用依赖的积木协议进行交互的部分，则可以使用stub或者mock来构造依赖的假的积木实现

对于集成测试或者运行测试：
开发单个积木的开发者可以在本地构造假的Client，并构造假的BlockFacade的init函数来注册需要测试的积木；然后运行Client来测试





## 缺点

无


## 使用场景

### 场景描述

多人开发的大型系统

### 具体案例

- 多人开发的引擎

引擎的动画、场景管理、模型加载、粒子、物理等模块都可以作为一个或多个单独的积木

整个引擎可以完全由积木搭建而成


- 多人开发的编辑器

编辑器的引擎调用逻辑、UI、撤销重做、导入导出、发布等模块都可以作为一个或多个单独的积木

整个编辑器可以完全由积木搭建而成


## 注意事项

- 积木模式是影响全局架构的模式，最好在最开始开发的时候就使用积木模式来设计整体架构

- 确保积木协议足够抽象，避免频繁改动


# 扩展

- 对积木协议中定义的服务、state的类型使用Dependent Type来加强类型约束，从而在编译期间尽量除错

- 对积木本身进行扩展

有些积木本身需要进行扩展
如一个积木有自己的数据，有默认的方式来操作数据。现在注册积木的用户希望能够用自定义的方式来操作这些数据，实现的思路是将默认的方式和自定义的方式这两个方式作为对这个积木的两个扩展，用户在注册该积木时指定使用哪个扩展
积木应该有两种类型：默认类型、扩展类型，积木的扩展属于扩展类型的积木


具体来说：
假设在开发编辑器时，编辑器使用了一个引擎积木，它维护所有的场景数据，实现了用默认的组件来操作场景数据
如果我们希望能够使用自定义的组件来操作它的场景数据，该如何实现？

我们可以将积木分为两种类型：
Extension
Contribute

Extension即是前面提到的默认类型，Contribute即是前面提到的扩展类型
其中Contribute是Extension的扩展，Extension有积木数据，Contribute没有积木数据

那么就可以实现一个Extension：Engine Extension，它是编辑器使用的引擎积木，负责维护所有的场景数据；
实现两个Contribute：EngineSceneContribute1、EngineSceneContribute2，它们是对Engine Extension的扩展，实现了同一个积木协议。
前者使用默认的组件来操作Engine Extension的场景数据，后者使用自定义的组件来操作Engine Extension的场景数据

用户在注册Engine Extension积木时，可以指定注册其中一个Contribute，从而实现使用默认的方式或者自定义的方式来操作场景数据


实现的它们的参考代码如下：
Engine Extension
```ts
export let getExtensionBlockService: getExtensionBlockServiceBlockManager<
    dependentExtensionNameMap,
    //加入dependentContributeNameMap
    dependentContributeNameMap,
    service
> = (api, [{ extension1ProtocolName, ...}, { engineSceneContributeProtocolName }]) => {
    return {
        operateScene: (blockManagerState) => {
			//通过Contribute的积木协议来调用Contribute的积木实现的服务
            let { operate } = api.getContribute<engineSceneContributeService>(blockManagerState, engineSceneContributeProtocolName)

            //操作场景数据
            operate(xxx)

            ...
        }
	}
}

export let createExtensionBlockState: createExtensionBlockStateBlockManager<
	state
> = () => {
	return {
        初始化场景数据...
    }
}

//获得依赖的所有Extension积木协议名
export let getDependentExtensionBlockProtocolNameMap: getDependentExtensionBlockProtocolNameMapBlockManager = () => {
	return {
		"extension1ProtocolName": "xxx",
	}
}

//获得依赖的所有Contribute积木协议名
export let getDependentContributeBlockProtocolNameMap: getDependentContributeBlockProtocolNameMapBlockManager = () => {
    //两个Contribute都实现了名为engine_scene_contribute_protocol的积木协议
	return {
		"engineSceneContributeProtocolName": "engine_scene_contribute_protocol",
	}
}
```
EngineSceneContribute1
```ts
export let getContributeBlockService: getContributeBlockServiceBlockManager<
    dependentExtensionNameMap,
    dependentContributeNameMap,
    service
> = (api, [{...}, {...}]) => {
    return {
        operate: (...) => {
            console.log("使用默认的组件操作场景数据")
        }
	}
}

export let getDependentExtensionBlockProtocolNameMap: getDependentExtensionBlockProtocolNameMapBlockManager = () => {
	return {
        ...
	}
}

export let getDependentContributeBlockProtocolNameMap: getDependentContributeBlockProtocolNameMapBlockManager = () => {
	return {
        ...
	}
}

//Contribute没有create block state函数
```
EngineSceneContribute2
```ts
export let getContributeBlockService: getContributeBlockServiceBlockManager<
    dependentExtensionNameMap,
    dependentContributeNameMap,
    service
> = (api, [{...}, {...}]) => {
    return {
        operate: (...) => {
            console.log("使用自定义的组件操作场景数据")
        }
	}
}

export let getDependentExtensionBlockProtocolNameMap: getDependentExtensionBlockProtocolNameMapBlockManager = () => {
	return {
        ...
	}
}

export let getDependentContributeBlockProtocolNameMap: getDependentContributeBlockProtocolNameMapBlockManager = () => {
	return {
        ...
	}
}

//Contribute没有create block state函数
```

在BlockFacade的init函数中注册Engine Extension和Contribute的参考代码如下：
BlockFacade
```ts
export let init = (): blockManagerState => {
    ...

    //注册Engine Extension积木
    blockManagerState = registerExtensionBlock(
        blockManagerState,
        "engine_extension_protocol",
        EngineBlockService.getExtensionBlockService,
        EngineBlockService.getDependentExtensionBlockProtocolNameMap(),
        EngineBlockService.getDependentContributeBlockProtocolNameMap(),
        EngineBlockService.createExtensionBlockState()
    )

    //注册EngineSceneContribute1或者EngineSceneContribute2积木
    blockManagerState = registerContributeBlock(
        blockManagerState,
        //实现同一个积木协议
        "engine_scene_contribute_protocol",
        //选择EngineSceneContribute1或者EngineSceneContribute2
        (EngineSceneContribute1 或者 EngineSceneContribute2).getContributeBlockService,
        (EngineSceneContribute1 或者 EngineSceneContribute2).getDependentExtensionBlockProtocolNameMap(),
        (EngineSceneContribute1 或者 EngineSceneContribute2).getDependentContributeBlockProtocolNameMap(),
    )
    ...
}
```




- 积木加入钩子函数

积木可以在不同的时机执行对应的钩子函数，从而实现对积木的生命周期的控制

如积木可以加入onRegister函数，该函数在注册该积木时被执行

积木的参考代码：
Block
```ts
//加入getBlockLife函数
export let getBlockLife: getBlockLifeBlockManager<service> = (api, blockProtocolName) => {
	return {
		onRegister: (blockManagerState, service) => {
			console.log("register!")

			return blockManagerState
		}
	}
}
```
BlockManagerType
```ts
type blockLife<blockService> = {
	onRegister?: (state: state, blockService: blockService) => state,
}

export type getBlockLife<blockService> = (_1: api, blockProtocolName: blockProtocolName) => blockLife<blockService>
```

BlockManager的registerBlock函数需要执行积木的onRegister函数








<!-- # 结合其它模式

## 结合哪些模式？
## 使用场景是什么？
## UML如何变化？
## 代码如何变化？ -->




# 最佳实践

<!-- ## 结合具体项目实践经验，如何应用模式来改进项目？ -->
## 哪些场景不需要使用模式？

如果系统的开发者人数很少，就不需要积木模式

<!-- ## 哪些场景需要使用模式？ -->
## 给出具体的实践案例？


- 使用lerna管理monorepo

每个积木实现以及积木协议都可以作为一个单独的项目

如果使用monorepo来管理系统开发的话，整个系统就只有一个大的项目，项目中有很多独立的package，每个积木实现以及积木协议分别是一个package
可以使用lerna来管理monorepo



<!-- - 开发流程




TODO 开发流程：
划分积木
    服务
    数据
协议
开发
测试

由架构师带着所有开发者一起确定了各个积木协议后，就可以由每个开发者具体开发一个积木实现

 -->




# 更多资料推荐

我开发的[Meta3D](https://github.com/Meta3D-Technology/Meta3D)使用了积木模式来设计整体架构
Meta3D是开源的Web3D低代码开发平台，用来开发Web3D引擎和编辑器