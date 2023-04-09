# [引入故事，提出问题]

## 需求

甲想要实现3D引擎中的渲染，需要同时支持PC端、移动端

两个运行环境的差异如下所示：

- PC端支持WebGL2，移动端只支持WebGL1
- PC端可以使用延迟渲染的算法来渲染，移动端因为不支持multi render targets，所以只能使用前向渲染的算法来渲染


## 实现思路

甲实现了一个Render模块，该模块实现了初始化WebGL、渲染、Tonemap后处理的逻辑

为了处理运行环境的差异，他的思路如下；

- 在“初始化WebGL”中判断运行环境，如果是PC端就获得WebGL2的上下文，如果是移动端就获得WebGL1的上下文
- 在“渲染”中判断运行环境，如果是PC端就使用延迟渲染算法，如果是移动端就使用前向渲染算法
- 在“Tonemap”中判断运行环境，如果是PC端就使用WebGL2的上下文，如果是移动端就使用WebGL1的上下文



## 给出UML

TODO tu

Render实现了渲染


## 给出代码

Client
```ts
//假canvas
let canvas = {
    getContext: (_) => 1 as any
}

//指定运行环境
globalThis.isPC = true


let renderState = createState()

renderState = render(renderState, canvas)
```

我们首先创建了引擎的RenderState，保存渲染的所有数据；
最后进行渲染

我们看下Renderd相关代码：
RenderStateType
```ts
export type state = {
    gl: WebGLRenderingContext | WebGL2RenderingContext | null
}
```
Render
```ts
let _isPC = () => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    return globalThis.isPC
}

let _initWebGL = (state, canvas) => {
    let gl = null

    if (_isPC()) {
        gl = canvas.getContext("webgl2")
    }
    else {
        gl = canvas.getContext("webgl1")
    }

    return {
        ...state,
        gl: gl
    }
}

let _render = (state) => {
    if (_isPC()) {
        let gl = getExnFromStrictNull(state.gl) as WebGL2RenderingContext

        console.log("延迟渲染")
    }
    else {
        let gl = getExnFromStrictNull(state.gl) as WebGLRenderingContext

        console.log("前向渲染")
    }

    return state
}

let _tonemap = (state) => {
    let gl = null

    if (_isPC()) {
        gl = getExnFromStrictNull(state.gl) as WebGL2RenderingContext
    }
    else {
        gl = getExnFromStrictNull(state.gl) as WebGLRenderingContext
    }

    console.log("tonemap")

    return state
}

export let createState = (): state => {
    return {
        gl: null
    }
}

export let render = (state: state, canvas) => {
    state = _initWebGL(state, canvas)
    state = _render(state)
    state = _tonemap(state)

    return state
}
```

在渲染的时候判断了运行环境，执行对应的逻辑


下面，我们运行代码，运行结果如下：
```text
is PC
初始化WebGL2
延迟渲染
tonemap for WebGL2
```

因为这里指定环境为PC端，所以执行的是PC端的渲染逻辑




## 提出问题

为了加快开发进度，甲找到了开发者乙一起开发，其中甲负责PC端的渲染实现，乙负责移动端的渲染实现

- 由于两个运行环境的逻辑混杂在一起，导致两个开发者开发时互相影响，容易出现代码冲突，最终导致开发进度逐渐变慢



# [给出可能的改进方案，分析存在的问题]?


## 概述解决方案？

TODO continue

## 给出UML？
## 结合UML图，描述如何具体地解决问题？
## 给出代码？


<!-- ## 请分析存在的问题?
## 提出改进方向？ -->
## 提出问题


# [给出使用模式的改进方案]

## 概述解决方案
## 给出UML？
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
