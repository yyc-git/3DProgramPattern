# [引入故事，提出问题]

## 需求

开发者甲需要从0开始，开发一个引擎


## 实现思路

TODO remove WebGL

<!-- 他首先实现了一个引擎的Demo，直接使用WebGL绘制出了一个最简单的场景 -->
首先，他实现了一个引擎的Demo，使用图形API绘制出了一个最简单的场景；
<!-- 他首先实现了一个引擎的Demo，直接使用WebGL绘制出了包括三个三角形的简单场景； -->
然后，他从Demo中提炼出了引擎的最基本的框架，包括初始化、主循环这两个步骤



## 给出UML

**领域模型**
TODO tu


这是甲提出的引擎基本框架的领域模型


总体来看，分为用户、引擎这两个部分

我们看下用户这个部分：

Client是用户


我们看下引擎这个部分：

Engine是引擎的入口模块，提供API给Client

Director负责初始化和主循环



## 给出代码

首先，我们看下用户的代码；
然后，我们看下Engine和Director的代码；
最后，我们运行代码


### 用户的代码

Client
```ts
DirectorAPI.init()
DirectorAPI.loop()
```

我们通过Engine的API，调用了Director的init和loop函数，实现引擎的初始化和主循环


### Engine和Director的代码

Engine
```ts
export let DirectorAPI = {
    init: Director.init,
    loop: Director.loop
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

### 运行代码

下面，我们运行代码，运行结果如下：
```text
初始化
主循环
```


## 提出问题

甲发现一个人开发引擎需要的时间太长，于是找了另外三个开发者乙、丙、丁一起来开发




# [解决问题的方案，分析存在的问题]?


## 概述解决方案？

- 分工
他们的分工如下：
甲继续开发Engine和Director；
乙负责实现实现一个数学库，实现矩阵计算之类的逻辑；
丙负责实现场景的管理；
丁负责实现渲染


## 给出UML？

**领域模型**
TODO tu
这是引擎基本框架新的领域模型


总体来看，分为用户、引擎这两个部分

我们看下用户这个部分：

Client是用户



我们看下引擎这个部分：

Engine和Director跟之前一样

我们介绍新加入的引擎模块，他们由分别由一个新的开发者负责开发：

SceneManager负责场景的管理，由丙负责开发

Render负责渲染，由丁负责开发

Math负责数学计算，由乙负责开发






我们介绍下各个模块的依赖关系：

Engine依赖Director、SceneManager，封装它们来提供初始化、主循环和管理场景的API

Director依赖SceneManager、Render，在初始化时分别通过它们初始化场景和初始化渲染，在主循环时分别通过它们更新场景和渲染

Render依赖SceneManager，在渲染时通过它获得场景数据

SceneManager、Render依赖Math，通过它进行数学计算


<!-- ## 结合UML图，描述如何具体地解决问题？ -->


## 给出代码？

首先，我们看下用户的代码；
然后，我们看下Engine的代码
然后，我们看下创建EngineState的代码
然后，我们看下创建场景的代码
然后，我们看下初始化的代码
然后，我们看下主循环的代码
最后，我们运行代码


### 用户的代码


Client
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


### Engine的代码

Engine
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

Engine负责提供API给Client


### 创建EngineState的代码

Director
```ts
export let createState = (): engineState => {
    return {
        scene: SceneManager.createState()
    }
}
```
createState函数创建的EngineState保存了创建的SceneManagerState，而SceneManagerState负责保存场景数据

<!-- createState函数调用了SceneManager的createState函数来初始化场景数据，我们看下相关代码： -->

我们看下创建SceneManagerState的代码：
SceneManager
```ts
export let createState = (): sceneManagerState => {
    return { allGameObjects: [] }
}
```

createState函数创建的SceneManagerState包括了场景中所有的gameObject
<!-- 目前它的值是空数组，表示场景中目前没有gameObject -->




### 创建场景的代码

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
            //通过concat而不是push来加入，保持immutable
            allGameObjects: state.scene.allGameObjects.concat([sceneGameObject])
        }
    }
}
```

createScene函数创建了场景，场景中只有一个gameObject
这里具体是创建了一个gameObject，并将其加入到SceneManagerState的allGameObjects数组中


### 初始化的代码

Director
```ts
export let init = (engineState) => {
    engineState = SceneManager.init(engineState)
    engineState = Render.init(engineState)

    return engineState
}
```

init函数实现了初始化，调用了SceneManager来初始化场景，以及调用了Render来初始化渲染

我们看下相关代码：
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


### 主循环的代码

Director
```ts
//假实现
let requestAnimationFrame = (func) => {
}

export let loop = (engineState: engineState) => {
    engineState = SceneManager.update(engineState)
    engineState = Render.render(engineState)

    requestAnimationFrame(
        (time) => {
            loop(engineState)
        }
    )
}
```

loop函数实现了主循环，调用了SceneManager来更新场景，以及调用了Render来渲染

我们看下更新场景的相关代码：
SceneManager
```ts
export let update = (state: engineState) => {
    console.log("更新场景")

    let _ = Math.multiplyMatrix(1, 2)

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

SceneManager的update函数实现了更新场景，调用了Math来计算


我们看下渲染的相关代码：
Render
```ts
export let render = (engineState: engineState) => {
    let allGameObjects = SceneManager.getAllGameObjects(engineState)

    console.log("处理场景数据")

    let _ = Math.multiplyMatrix(1, 2)

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

Render的render函数实现了渲染，调用了SceneManger来获得场景中所有的gameObjects，以及调用了Math来计算


### 运行代码

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
因为这四个开发者实现的模块互相依赖，所以可能会出现下面的情况：
一个开发者修改了自己的代码，如果该代码是被其它开发者实现的模块依赖，则会影响到它们；
一个开发者可能需要修改其它开发者的代码，如实现Render的丁可能会修改丙实现的SceneManager的代码，使其能提供某些特定的场景数据

这些情况都会造成在开发者合并自己的代码时出现大量的冲突

<!-- ，结果在合并代码时发现SceneManager提供的是其它的数据 -->


<!-- # [给出可能的改进方案，分析存在的问题]?



## 概述解决方案？
## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？


## 提出问题 -->


# [给出使用模式的改进方案]

## 概述解决方案


<!-- 通过下面的改进来降低模块之间的依赖： -->

<!-- - 降低模块之间的依赖 -->

<!-- 通过下面的改进来降低模块之间的依赖： -->
- 将每个模块改为一个独立的积木，互相之间只依赖于抽象的协议
积木包括积木实现和积木协议两个部分，其中积木协议定义了积木提供的服务和积木包括的数据的类型；
积木实现是对积木协议的实现

积木的服务就是多个实现积木逻辑的函数；
积木的数据是一个state，该state保存了积木所有的数据

每个积木之间依赖的是抽象的积木协议而不是具体的积木实现

- 大家首先一起定义好各个积木的协议，然后每个开发者只独立开发自己的积木实现，互相之间通过积木协议交互



## 给出UML？


**领域模型**
TODO tu


总体来看，分为用户、BlockFacade、BlockManager、Engine Blocks这四个部分



我们看下用户这个部分：

Client是用户



我们看下BlockFacade、BlockManager这两个部分：

BlockFacade提供了管理积木的API
<!-- ，它的init函数负责注册所有使用的积木 -->

BlockManager负责实现管理积木，提供了注册积木、获得积木的服务和state等函数




我们看下Engine Blocks这个部分：

Engine Blocks包括了各个积木的积木实现和积木协议

引擎完全由积木组成
之前的各个引擎模块都对应地改为积木了，其中Engine改为Engine Block，Director改为Director Block，SceneManager改为SceneManager Block，Render改为Render Block，Math改为Math Block

各个积木实现的逻辑不变，就是实现对应的之前引擎模块的逻辑

积木包括积木实现和积木协议这两个部分，其中积木协议的模块名以“Protocol”结尾，如Engine Block是积木实现，Engine Block Protocol是积木协议

积木实现是对积木协议的实现，如Engine Block实现了Engine Block Protocol


各个积木实现之间没有直接依赖，而是依赖抽象的积木协议，如Engine Block没有依赖Director Block，而是依赖它实现的积木协议：Directo Block Protocol


在所有的积木中，需要定义一个积木作为入口
入口积木向Client提供了调用其它积木的API

这里Engine Block就是入口积木的积木实现，Engine Block Protocol是入口积木的积木协议

Client调用入口积木的方式如下：
首先Client调用BlockFacade的getEntryBlockProtocolName函数获得入口积木的积木协议名；
然后将其传给BlockFacade的getBlockService函数（作为blockProtocolName参数），获得入口积木的服务，从而使用它提供的API





## 结合UML图，描述如何具体地解决问题？

- 因为不同积木之间只依赖于积木协议，所以每个开发者只需要关注自己开发的积木实现。只要积木协议不修改，就不会互相影响，从而提升了团队的开发效率，降低了团队的沟通成本


## 给出代码？


首先，我们看下用户的代码
然后，我们看下用户的代码中第一个步骤（初始化积木）的代码
然后，我们看下初始化积木中每个步骤的相关代码，它们包括：
- 创建BlockManagerState的代码
- BlockManager的registerBlock函数的相关代码
- 积木实现的三个函数的代码

然后，我们继续看下用户的代码中剩余的每个步骤的代码，它们包括：
- 获得入口积木的服务的代码
- 创建场景的代码
- 初始化的代码
- 主循环的代码

最后，我们运行代码


### 用户的代码

Client
```ts
let blockManagerState = BlockFacade.init()

//获得了入口积木-Engine Block的服务
let { director, scene } = BlockFacade.getBlockService<service>(blockManagerState, BlockFacade.getEntryBlockProtocolName())

blockManagerState = scene.createScene(blockManagerState)

blockManagerState = director.init(blockManagerState)

director.loop(blockManagerState)
```

我们首先调用BlockFacade的init函数初始化积木；
然后调用BlockFacade的getEntryBlockProtocolName函数获得入口积木的积木协议-Engine Block Protocol的协议名，并将其传给BlockFacade的getBlockService函数后获得入口积木Engine Block的服务；
然后调用服务的scene的createScene函数，创建了场景；
然后调用服务的director的init函数，实现初始化；
最后调用服务的director的loop函数，实现主循环

### 初始化积木的代码

BlockFacade
```ts
export let init = (): blockManagerState => {
    let blockManagerState = BlockManager.createState()

    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "engine_block_protocol",
        EngineBlock.getBlockService,
        EngineBlock.getDependentBlockProtocolNameMap(),
        EngineBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "director_block_protocol",
        DirectorBlock.getBlockService,
        DirectorBlock.getDependentBlockProtocolNameMap(),
        DirectorBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "sceneManager_block_protocol",
        SceneManagerBlock.getBlockService,
        SceneManagerBlock.getDependentBlockProtocolNameMap(),
        SceneManagerBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "render_block_protocol",
        RenderBlock.getBlockService,
        RenderBlock.getDependentBlockProtocolNameMap(),
        RenderBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "math_block_protocol",
        MathBlock.getBlockService,
        MathBlock.getDependentBlockProtocolNameMap(),
        MathBlock.createBlockState()
    )

    return blockManagerState
}
```

init函数实现了初始化积木，它首先调用BlockManager的createState函数创建BlockManagerState，用来保存所有的积木数据；
然后调用多次BlockManager的registerBlock函数，注册了Engine Blocks中所有的积木

在注册积木时传入了BlockManagerState、积木协议名、获得积木的服务的函数、积木依赖的所有积木协议名、积木的state；


### 创建BlockManagerState的代码


<!-- 我们看下BlockManager的createState函数代码： -->
BlockManager
```ts
export let createState = (): state => {
    return {
        blockServiceMap: Map(),
        blockStateMap: Map()
    }
}
```

createState函数创建了BlockManagerState，它包括一个保存所有积木的服务的Hash Map和一个保存所有积木的state的Hash Map，它们的Key是积木协议名，Value分别是积木服务和积木state


### BlockManager的registerBlock函数的相关代码

<!-- 我们看下BlockManager的registerBlock函数的相关代码： -->
BlockManager
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

registerBlock函数实现了注册积木，它首先通过传入的getBlockService函数获得积木的服务，将其保存在BlockManagerState的blockServiceMap中；
最后将传入的积木的state保存在BlockManagerState的blockStateMap中

<!-- 值得注意的是： -->
registerBlock函数在调用传入的getBlockService函数时，注入了依赖于_buildAPI函数构造的BlockManager的api和积木依赖的所有积木协议名，从而使得该积木能在它的服务中能够通过它们来调用依赖的其它积木的服务和state，如Engine Block积木能通过它们调用SceneManagerBlock的服务和state


### 积木实现的三个函数的代码

BlockFacade的init函数在调用BlockManager的registerBlock函数注册积木时，调用了该积木的积木实现的三个函数：getBlockService、getDependentBlockProtocolNameMap、createBlockState

我们以Engine Block为例，来看下它的三个函数的相关代码：
Engine Block
```ts
//获得积木的服务
export let getBlockService: ... = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
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

//创建积木的state
export let createBlockState: ... = () => {
    //因为该state为空，所以返回null
	return null
}

//获得依赖的所有积木协议名
//（因为Engine Block依赖DirectorBlockProtocol、SceneManagerProtocol，所以这里要给出它们的积木协议名)
export let getDependentBlockProtocolNameMap: ... = () => {
	return {
		"directorBlockProtocolName": "director_block_protocol",
		"sceneManagerBlockProtocolName": "sceneManager_block_protocol"
	}
}
```

getBlockService函数实现了Engine Block Protocol定义的服务
createBlockState函数实现了Engine Block Protocol定义的state

我们看下Engine Block Protocol对应的代码：
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




### 获得入口积木的服务的代码

<!-- Client
```ts
//获得了入口积木-Engine Block的服务
let { director, scene } = BlockFacade.getBlockService<service>(blockManagerState, BlockFacade.getEntryBlockProtocolName())
``` -->
BlockFacade
```ts
//获得Engine Block Protocol的协议名
export let getEntryBlockProtocolName = () => "engine_block_protocol"

...

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return BlockManager.getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
```

BlockFacade的getBlockService函数通过BlockManager的getBlockServiceExn函数获得了注册的积木服务。
Client通过指定BlockFacade的getBlockService函数的参数blockProtocolName为Engine Block Protocol的协议名，从而获得了Engine Block的服务



### 创建场景的代码



<!-- 我们继续看Client中创建场景的相关代码：
Client
```ts
blockManagerState = scene.createScene(blockManagerState)
``` -->

Client调用了Engine Block的服务，创建了场景

<!-- 这里调用了Engine Block的服务的scene的createScene函数，我们看下相关代码： -->

我们看下Engine Block的相关代码：
Engine Block
```ts
export let getBlockService: ... = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
	return {
        ...
		scene: {
			createScene: (blockManagerState) => {
				//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的createScene函数
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

Engine Block的服务的scene的createScene函数调用了Scene Manager Block的服务和state来创建场景，它依赖该积木的积木协议（SceneManager Block Protocol）而不是积木实现（Scene Manager Block）

只要积木协议（SceneManager Block Protocol）不变，那么不管这个积木实现（SceneManager Block）如何改变，都不会影响到Engine Block

我们看下SceneManager Block相关代码：
SceneManager Block
```ts
export let getBlockService: ... = (api, { mathBlockProtocolName }) => {
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

export let createBlockState: ... = () => {
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

SceneManager Block的state和服务的逻辑跟之前的SceneManager模块的SceneManagerState和逻辑一样，没有变化


### 初始化的代码


<!-- 我们回到Client，继续看Client中初始化的相关代码： -->
<!-- Client
```ts
blockManagerState = director.init(blockManagerState)
``` -->

Client调用了Engine Block的服务，实现初始化


<!-- 这里调用了Engine Block的服务的director的init函数，我们看下相关代码： -->
我们看下相关代码：
Engine Block
```ts
export let getBlockService: ... = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
	return {
		director: {
			init: (blockManagerState) => {
				//依赖于Director Block Protocol来调用Director Block的服务的init函数
				let { init } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return init(blockManagerState)
			},
            ...
	}
}
```


Engine Block的服务的director的init函数调用了Director Block的服务来实现初始化，它依赖该积木的积木协议（Director Block Protocol）

我们看下该积木的相关代码：
Director Block
```ts
export let getBlockService: ... = (api, { sceneManagerBlockProtocolName, renderBlockProtocolName }) => {
	return {
		init: (blockManagerState) => {
			//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的init函数
			let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			blockManagerState = sceneManagerService.init(blockManagerState)

			//依赖于Render Block Protocol来调用Render Block的服务的init函数
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

Director Block又依赖了SceneManager Block Protocol、Render Block Protocol，相关代码如下：
SceneManager Block
```ts
export let getBlockService: ... = (api, { mathBlockProtocolName }) => {
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
export let getBlockService: ... = (api, { sceneManagerBlockProtocolName, mathBlockProtocolName }) => {
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


同样的，SceneManager Block的服务和Render Block服务的逻辑跟之前的SceneManager、Render模块的逻辑一样，没有变化


### 主循环的代码


<!-- 我们回到Client，继续看Client中主循环的相关代码：
Client
```ts
director.loop(blockManagerState)
``` -->

Client调用了Engine Block的服务，实现主循环

<!-- 这里调用了Engine Block的服务的director的loop函数，我们看下相关代码： -->
我们看下相关代码：
Engine Block
```ts
export let getBlockService: ... = (api, { directorBlockProtocolName, sceneManagerBlockProtocolName }) => {
	return {
		director: {
            ...
			loop: (blockManagerState) => {
				//依赖于Director Block Protocol来调用Director Block的服务的loop函数
				let { loop } = api.getBlockService<directorService>(blockManagerState, directorBlockProtocolName)

				return loop(blockManagerState)
			}
        }
	}
}
```


Engine Block的服务的director的loop函数调用了Director Block的服务来实现主循环，它依赖该积木的积木协议（Director Block Protocol）

我们看下该积木的相关代码：
Director Block
```ts
//假实现
let requestAnimationFrame = (func) => {
}

let _loop = (api: api, blockManagerState: blockManagerState, sceneManagerBlockProtocolName: blockProtocolName, renderBlockProtocolName: blockProtocolName) => {
	//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的update函数
	let sceneManagerService = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

	blockManagerState = sceneManagerService.update(blockManagerState)

	//依赖于Render Block Protocol来调用Render Block的服务的render函数
	let renderService = api.getBlockService<renderService>(blockManagerState, renderBlockProtocolName)

	blockManagerState = renderService.render(blockManagerState)

	requestAnimationFrame(
		(time) => {
			_loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
		}
	)
}

export let getBlockService: ... = (api, { sceneManagerBlockProtocolName, renderBlockProtocolName }) => {
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

Director Block又依赖了SceneManager Block Protocol、Render Block Protocol，相关代码如下：
SceneManager Block
```ts
export let getBlockService: ... = (api, { mathBlockProtocolName }) => {
	return {
        ...
		getAllGameObjects: (sceneManagerState) => {
			return sceneManagerState.allGameObjects
		},
        ...
		update: (blockManagerState) => {
			console.log("更新场景")

			//依赖于Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			return blockManagerState
		}
	}
}

export let getDependentBlockProtocolNameMap: ... = () => {
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
export let getBlockService: ... = (api, { sceneManagerBlockProtocolName, mathBlockProtocolName }) => {
	return {
        ...
		render: (blockManagerState) => {
			//依赖于SceneManager Block Protocol来调用SceneManager Block的服务的getAllGameObjects函数
			let { getAllGameObjects } = api.getBlockService<sceneManagerService>(blockManagerState, sceneManagerBlockProtocolName)

			let allGameObjects = getAllGameObjects(api.getBlockState<sceneManagerState>(blockManagerState, sceneManagerBlockProtocolName))

			console.log("处理场景数据")

			//依赖于Math Block Protocol来调用Math Block的服务的multiplyMatrix函数
			let { multiplyMatrix } = api.getBlockService<mathService>(blockManagerState, mathBlockProtocolName)

			let _ = multiplyMatrix(1, 2)

			console.log("渲染")

			return blockManagerState
		}
	}
}
```

SceneManager Block和Render Block又依赖了Math Block Protocol，相关代码如下：
Math Block
```ts
export let getBlockService: ... = (api, _) => {
	return {
		multiplyMatrix: (mat1, mat2) => {
			console.log("计算")

			return 1
		}
	}
}

export let createBlockState: ... = () => {
	return null
}

export let getDependentBlockProtocolNameMap: ... = () => {
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


同样的，这几个Block的state和服务的逻辑跟之前对应的模块的state和逻辑一样，没有变化


### 运行代码


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

<!-- 通过搭建不同的积木来组装系统 -->
系统由积木搭建而成



## 补充说明


将系统的每个模块离散化为一个个独立的积木

积木之间依赖于协议而不是实现


## 通用UML？
TODO tu

TODO move +service to functions

## 分析角色？


我们来看看模式的相关角色：


总体来看，分为BlockFacade、BlockManager、System Blocks三个部分，其中System Blocks包括各个积木的积木实现和积木协议

整个系统由Block组成


我们看下BlockFacade、BlockManager这两个部分：

- BlockFacade
该角色封装了管理积木的API，它的init函数负责注册所有使用的积木

- BlockManager
该角色负责实现管理积木


我们看下System Blocks这个部分：

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
具体操作是在BlockFacade的init函数中只注册需要使用的积木

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
			//依赖于Contribute的积木协议来调用Contribute的积木实现的服务
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