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

总体来看，分为BlockFacade、BlockManager、Engine Blocks三个部分，其中Engine Blocks又包括各个积木实现和积木协议


TODO BlockFacade负责

TODO explain:入口block



<!-- 其中积木协议定义了提供的服务的接口和数据的类型 -->

<!-- 再加入一个BlockManager，负责管理积木 -->




## 结合UML图，描述如何具体地解决问题？

<!-- - 提出改进方向？ -->

TODO fix
1.如何让每个人独立地开发引擎的功能点，将互相之间的影响降到最低，从而能通过增加引擎的开发人员来实现加快引擎的开发进度？
2.如何将引擎模块化，使得引擎只包含Client需要的引擎模块，去除其它的引擎模块，从而减少引擎的文件大小

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
