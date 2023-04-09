# [引入故事，提出问题]

## 需求

甲想要实现3D引擎中的渲染，需要同时支持PC端、移动端

两个运行环境的差异如下所示：

- PC端支持WebGL2，移动端只支持WebGL1
- PC端可以使用延迟渲染的算法来渲染，移动端因为不支持multi render targets，所以只能使用前向渲染的算法来渲染


## 实现思路

甲实现了一个Render模块，该模块实现了渲染，包括初始化WebGL、渲染、Tonemap后处理这三个步骤

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

分离PC端和移动端的渲染逻辑：
从Render模块中提出两个模块：RenderInPC, RenderInMobile，分别对应PC端和移动端的渲染；

因为初始化WebGL、渲染、Tonemap后处理这三个步骤相对独立，所以将其拆分成单独的模块


## 给出UML？

TODO tu

Render负责判断运行环境，调用对应的渲染模块来渲染

RenderInPC实现了PC端的渲染

RenderInMobile实现了移动端的渲染

InitWebGL2负责初始化WebGL2

DeferRender实现延迟渲染

TonemapForWebGL2使用WebGL2实现Tonemap后处理

InitWebGL1负责初始化WebGL1

ForwardRender实现前向渲染

TonemapForWebGL1使用WebGL1实现Tonemap后处理





## 结合UML图，描述如何具体地解决问题？

- 现在甲负责RenderInPC和对应的三个模块，乙负责RenderInMobile和对应的另外三个模块，互相不影响




## 给出代码？


Client代码:
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

Client代码跟之前一样

我们看下Renderd的createState相关代码：
RenderStateType
```ts
export type renderInPCState = {
    gl: WebGL2RenderingContext | null
}

export type renderInMobileState = {
    gl: WebGL2RenderingContext | null
}

export type state = {
    renderInPC: renderInPCState,
    renderInMobile: renderInMobileState,
}
```
Render
```ts
export let createState = (): state => {
    return {
        renderInPC: {
            gl: null
        },
        renderInMobile: {
            gl: null
        }
    }
}
```

state使用两个字段来分别保存两个运行环境的数据，互不干扰


我们看下Renderd的Render相关代码：
```ts
let _isPC = () => {
    return globalThis.isPC
}

export let render = (state: state, canvas) => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    if (_isPC()) {
        state = renderInPC(state, canvas)
    }
    else {
        state = renderInMobile(state, canvas)
    }

    return state
}
```

render函数判断了运行环境，如果是PC端就调用RenderInPC模块来渲染；否则就调用RenderInMobile模块来渲染

我们看下RenderInPC代码
```ts
export let render = (state: state, canvas) => {
    state = initWebGL2(state, canvas)
    state = deferRender(state)
    state = tonemap(state)

    return state
}
```

它依次调用三个模块来执行渲染

三个模块的相关代码如下：
InitWebGL2
```ts
export let initWebGL2 = (state: state, canvas) => {
    console.log("初始化WebGL2")

    return {
        ...state,
        renderInPC: {
            gl: canvas.getContext("webgl2")
        }
    }
}
```
DeferRender
```ts
export let deferRender = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInPC.gl)

    console.log("延迟渲染")

    return state
}
```
TonemapForWebGL2
```ts
export let tonemap = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInPC.gl)

    console.log("tonemap for WebGL2")

    return state
}
```


我们看下RenderInMobile代码
```ts
export let render = (state: state, canvas) => {
    state = initWebGL1(state, canvas)
    state = forwardRender(state)
    state = tonemap(state)

    return state
}
```

它依次调用另外三个模块来执行渲染

三个模块的相关代码如下：
InitWebGL1
```ts
export let initWebGL1 = (state: state, canvas) => {
    console.log("初始化WebGL1")

    return {
        ...state,
        renderInMobile: {
            gl: canvas.getContext("webgl1")
        }
    }
}
```
ForwardRender
```ts
export let forwardRender = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInMobile.gl)

    console.log("前向渲染")

    return state
}
```
TonemapForWebGL1
```ts
export let tonemap = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInMobile.gl)

    console.log("tonemap for WebGL1")

    return state
}
```


下面，我们运行代码，运行结果如下：
```text
is PC
初始化WebGL2
延迟渲染
tonemap for WebGL2
```

运行结果跟之前一样




## 提出问题


- 不能通过配置来指定渲染的步骤
现在是通过函数调用的方式来执行渲染的三个步骤。
如果不懂代码的策划人员想要自定义三个步骤的执行顺序，那就需要麻烦开发人员来修改代码，而不能够直接通过修改配置数据来自定义

- 多人开发渲染的不同步骤的模块时容易造成冲突
现在甲负责开发RenderInPC和RenderInMobile中的InitWebGL1，乙负责开发RenderInMobile中的另外两个步骤模块，那么当他们合并RenderInMobile的代码时容易出现代码冲突和Bug。
这是因为RenerInMobile的三个步骤模块之间相互依赖，即另外两个步骤模块依赖InitWebGL1模块，所以如果甲负责的InitWebGL1模块修改了，会影响到乙负责的模块




# [给出使用模式的改进方案]

## 概述解决方案


通过下面的改进来实现通过配置来指定渲染的步骤：
将RenderInPC和RenderInMobile模块改为两个管道
将每个步骤的模块改为独立的Job。它们按照JSON配置指定的执行顺序，在对应的管道中执行

通过下面的改进来解决冲突的问题：
因为不同的管道相互独立，同一个管道中的Job也是相互独立，它们相互之间不依赖，所以甲和乙同时开发RenderInMobile管道的不同的Job是不会相互影响的



## 给出UML？

TODO tu




总体来看，分为Render、PipelineManager、三个管道、三个管道state以及对应的state类型、三个管道包括的Job这几个部分


Render负责按照运行环境注册对应的管道，然后依次执行管道的Job来实现渲染

PipeManager负责管理管道

三个管道包括甲负责的RenderInPCPipeline、甲负责的JiaRenderInMobilePipeline、乙负责的YiRenderInMobilePipeline

每个管道维护了JSON配置数据，它们用来指定管道中Job的执行顺序

每个管道都包括了自己的数据，保存自己的PipelineState中

每个PipelineState的类型定义在PipelineStateType中

每个管道都包括了一个或多个Job，之前的步骤模块现在都对应地改为Job

每个Job都能读写所有管道的PipelineState


## 结合UML图，描述如何具体地解决问题？

- RenderInPCPipeline、JiaRenderInMobilePipeline、YiRenderInMobilePipeline这三个管道都维护了JSON配置数据，不懂开发的策划人员只需要配置它们们而不需要修改其它代码，即可指定渲染的步骤

- 甲和乙开发的是不同的管道，它们之间唯一的依赖是乙开发的管道的PipelineState-YiRenderInMobilePipelineState使用了甲开发的管道的PipelineState-JiaRenderInMobilePipeline，它们的依赖是类型（PipelineStateType）之间的依赖。只要类型JiaRenderInMobilePipelineStateType不变（类型是抽象的，一般都不会改变），则甲、乙之间的开发就不会互相影响



## 给出代码？


Client代码:
```ts
//假canvas
let canvas = {
    getContext: (_) => 1 as any
}

//指定运行环境
globalThis.isPC = true


let renderState = createState()

renderState = registerAllPipelines(renderState)

render(renderState, canvas).then(newRenderState => {
    renderState = newRenderState
})
```

TODO continue





TODO
这里需要实现的是能够合并甲、乙开发的同属于RenderInMobile管道的两个子管道。其中乙实现的两个Job应该在甲实现的Job之后执行，并且乙的Job需要读甲的子管道数据：WebGL1的上下文


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

<!-- ////TODO Job最好只写自己所属的管道的PipelineState，不是要写其它管道的PipelineState -->

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
