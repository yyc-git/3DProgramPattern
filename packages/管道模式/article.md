# [引入故事，提出问题]

## 需求

甲想要实现引擎中的渲染，需要同时支持PC端、移动端

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

我们看下Render相关代码：
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

我们看下Render的createState相关代码：
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


我们看下Render的render相关代码：
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




<!-- 总体来看，分为Render、PipelineManager、三个管道、三个管道state以及对应的state类型、三个管道包括的Job这几个部分 -->
总体来看，分为Render、PipelineManager、三个管道这三个部分


我们看下Render、PipelineManager这两个部分：


Render负责按照运行环境注册对应的管道，以及调用render函数来运行管道，依次执行它的Job来实现渲染

PipeManager负责管理管道，实现了注册管道、合并管道、运行管道的相关逻辑



我们看下三个管道这个部分：

这里有三个管道模块，具体为甲负责的RenderInPCPipeline、甲负责的JiaRenderInMobilePipeline、乙负责的YiRenderInMobilePipeline

每个管道模块都有自己的PipelineState，具体为RenderInPCPipelineState、JiaRenderInMobilePipelineState、YiRenderInMobilePipelineState

每个PipelineState的实现了定义在PipelineStateType中的类型，PipelineStateType具体有RenderInPCPipelineStateType、JiaRenderInMobilePipelineStateType、YiRenderInMobilePipelineStateType

每个管道模块包括了多个管道，它们的数据都保存在PipelineState中
这里每个管道模块只包括了一个管道：Render Pipeline，该管道实现了渲染相关的逻辑

每个管道包括了多个Job
之前的步骤模块现在都对应地改为Job

每个Job都能读写所有管道模块的PipelineState，但它们没有直接依赖PipelineState，而是依赖它的类型（PipelineStateType）。
这里可以看到RenderInPCPipeline的Render Pipeline管道的三个Job依赖了RenderInPCPipeineStateType，这是因为它们需要读写RenderInPCPipelineState。当然它们也可以通过依赖另外两个管道模块的PipelineStateType来读写另外两个管道模块的PipelineState，只是目前没有必要
同理，YiRenderInMobilePipeline的Render Pipeline管道的两个Job依赖了YiRenderInMobilePipelineStateType和JiaRenderInMobilePipelineStateType，这是因为它们需要读写YiRenderInMobilePipeline、JiaRenderInMobilePipeline这两个管道模块的PipelineState



下图是数据视图：
TODO tu

数据分为运行时数据和配置数据，其中各个State是运行时数据，各个JSON是配置数据

Render有自己的数据-RenderState，它包括了其它的state

PipeManager有自己的数据-PipeStateManagerState，它包括了所有管道模块的PipelineState

三个管道模块各自有一个PipelineState数据和一个JSON配置数据，其中PipelineState保存了管道模块中所有管道的运行时数据，JSON配置数据用来指定管道模块中所有管道的Job的执行顺序




## 结合UML图，描述如何具体地解决问题？

- RenderInPCPipeline、JiaRenderInMobilePipeline、YiRenderInMobilePipeline这三个管道模块都有JSON配置数据，不懂开发的策划人员只需要配置它们而不需要修改代码，即可指定渲染的步骤

- 甲和乙开发的是不同的管道模块，它们之间唯一的依赖是乙开发的管道模块的PipelineState（YiRenderInMobilePipelineState）使用了甲开发的管道模块的PipelineState（JiaRenderInMobilePipeline）。因为它们的依赖是类型（PipelineStateType）之间的依赖，只要JiaRenderInMobilePipelineStateType不变（类型是抽象的，一般都不会改变），则甲、乙之间的开发就不会互相影响



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


Client代码跟之前基本上一样，只是多出了调用了registerAllPipelines函数来注册管道

首先，我们看下Render的createState相关代码：
Render
```ts
export let createState = (): state => {
    return {
        pipelineManagerState: createPipelineManagerState()
    }
}
```

createState函数创建了RenderState
它调用了PipelineManager的createState函数，创建了PipelineManagerState，将其保存在RenderState中



然后，我们看下Render的registerAllPipelines相关代码：
```ts
export let registerAllPipelines = (state: state) => {
    if (_isPC()) {
        let pipelineManagerState = registerPipeline(
            state.pipelineManagerState,
            getRenderInPCPipeline(),
            []
        )

        state = {
            ...state,
            pipelineManagerState: pipelineManagerState
        }
    }
    else {
        let pipelineManagerState = registerPipeline(
            state.pipelineManagerState,
            getJiaRenderInMobilePipeline(),
            []
        )
        pipelineManagerState = registerPipeline(
            pipelineManagerState,
            getYiRenderInMobilePipeline(),
            [
                {
                    pipelineName: "render",
                    insertElementName: "init_webgl1_jia_renderInMobile",
                    insertAction: "after"
                }
            ]
        )

        state = {
            ...state,
            pipelineManagerState: pipelineManagerState
        }
    }

    return state
}
```

这里判断运行环境，注册对应的管道
如果是PC端，就注册RenderInPCPipeline中所有的管道，也就是它的Render Pipeline管道；
如果是移动端，就注册JiaRenderInMobilePipeline、YiRenderInMobilePipeline中所有的管道，也就是它们的Render Pipeline管道

值得注意的是，移动端的注册是将两个管道模块的Render Pipeline管道进行了合并
<!-- YiRenderInMobilePipeline管道合并到JiaRenderInMobilePipeline管道中 -->


这里调用了PipelineManager的registerPipeline函数来注册管道，它接收三个参数，返回新的PipelineManagerState
三个参数分别为PipelineManagerState、管道模块的数据
OK、JobOrders，其中，JobOrders用来指定如何合并管道，后面会在讨论；管道模块的数据是通过调用管道模块的getPipeline函数获得的


我们来看下移动端的两个管道模块的相关代码，首先看下JiaRenderInMobilePipeline相关代码：
JiaRenderInMobilePipelineStateType
```ts
export const pipelineName = "JiaRenderInMobile"

export type state = {
    gl: WebGLRenderingContext | null
}

export type states = {
    [pipelineName]: state,
}

```
JiaRenderInMobilePipeline
```ts
let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl1_jia_renderInMobile":
            //返回Job的exec函数
			return execInitWebGL1
		default:
			return null
	}
}

//获得管道模块的数据
export let getPipeline = (): pipeline<renderState, state> => {
	return {
        //pipelineName来自JiaRenderInMobilePipelineStateType，这里具体为"JiaRenderInMobile"
		pipelineName: pipelineName,
        //创建JiaRenderInMobilePipelineState
		createState: renderState => {
			return {
				gl: null
			}
		},
        //getExec关联了allPipelineData中的job名与管道的Job
		getExec: _getExec,
        //allPipelineData是JSON配置数据，用来指定Job的执行顺序
        //它包括多个管道的配置数据，这里只有一个Render Pipeline管道
		allPipelineData: [
			{
                //管道名
				name: "render",
                //groups包括所有的group，这里只有一个group
				groups: [
					{
                        //group名
						name: "first_jia_renderInMobile",
                        //link指定了该group包括的所有element之间的链接方式
                        //有两种链接方式：concat或者merge
                        //concat是指每个element串行执行
                        //merge是指每个element并行执行
						link: "concat",
                        //elements是该group包含的所有element
                        //element的类型可以为job或者group
                        //这里只有一个类型为job的element
						elements: [
							{
								"name": "init_webgl1_jia_renderInMobile",
								"type_": "job"
							}
						]
					}
				],
                //运行该管道时首先执行的group名
				first_group: "first_jia_renderInMobile"
			}
		],
	}
}
```

JiaRenderInMobilePipeline只有一个Render Pipeline管道，它只有一个Job：InitWebGL1Job

我们看下Job相关代码：
InitWebGL1Job
```ts
export let exec: execType<renderState> = (renderState, { getStatesFunc, setStatesFunc }) => {
    //从RenderState中获得所有管道的PipelineState
	let states = getStatesFunc<renderState, states>(renderState)

	let canvas: HTMLCanvasElement = globalThis.canvas

    //调用most.js库，返回了一个流
	return mostService.callFunc(() => {
		console.log("初始化WebGL1")

		let gl = canvas.getContext("webgl")

        //将新的states保存到RenderState中，返回新的RenderState
		return setStatesFunc<renderState, states>(
			renderState,
            //将新的JiaRenderInMobilePipelineState保存到states中，返回新的states
			setState(states, {
                //获得JiaRenderInMobilePipelineState，拷贝为新的JiaRenderInMobilePipelineState
				...getState(states),
                //保存gl到新的JiaRenderInMobilePipelineState
				gl: gl
			})
		)
	})
}
```
Utils
```ts
export function getState(states: states): state {
    //pipelineName来自JiaRenderInMobilePipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自JiaRenderInMobilePipelineStateType
        [pipelineName]: state
    })
}
```


虽然这个Job只有同步操作，但是Job其实可能会进行异步操作的，而处理异步一般有两种方法：
1.通过Async、Await，将异步转换为同步
2.Promise

这里我们使用第三种方法：基于FRP（函数反应型编程），使用流来处理异步操作。
具体为让每个Job都返回一个流，流的处理函数执行Job的逻辑

这样做的一个好处是能够轻易实现Job的concat或者merge的链接，只需要将每个Job返回的流concat或者merge即可
另一个好处是能够轻易实现合并管道，因为一个管道就是一个流，合并管道就是合并流，这容易实现

我们这里使用了most.js库来实现流，它是一个FRP库，相比Rxjs库性能要更好


我们来看下另一个管道模块-YiRenderInMobilePipeline相关代码：
YiRenderInMobilePipelineStateType
```ts
export const pipelineName = "YiRenderInMobile"

export type state = {
}

export type states = {
    [pipelineName]: state,
    [jiaRenderInMobilePipelineName]: jiaRenderInMobilePipelineState,
}
```

因为YiRenderInMobilePipeline中的Job需要通过states来获得YiRenderInMobilePipelineState和JiaRenderInMobilePipelineState，YiRenderInMobilePipelineStateType的states需要定义自己的YiRenderInMobilePipelineState以及JiaRenderInMobilePipelineState


YiRenderInMobilePipeline
```ts
let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "forward_render_yi_renderInMobile":
			return execForwardRender
		case "tonemap_yi_renderInMobile":
			return execTonemap
		default:
			return null
	}
}

export let getPipeline = (): pipeline<renderState, state> => {
	return {
		pipelineName: pipelineName,
		createState: renderState => {
			return {
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "render",
				groups: [
					{
						name: "first_yi_renderInMobile",
						link: "concat",
						elements: [
							{
								"name": "forward_render_yi_renderInMobile",
								"type_": "job"
							},
							{
								"name": "tonemap_yi_renderInMobile",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_yi_renderInMobile"
			}
		],
	}
}

```

YiRenderInMobilePipeline只有一个Render Pipeline管道，它有两个Job：ForwardRenderJob、TonemapJob


Job相关代码如下：
ForwardRenderJob
```ts
export let exec: execType<renderState> = (renderState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<renderState, states>(renderState)

	return mostService.callFunc(() => {
		let gl = getGL(states)

		console.log("前向渲染")

		return renderState
	})
}
```
TonemapJob
```ts
export let exec: execType<renderState> = (renderState, { getStatesFunc }) => {
    let states = getStatesFunc<renderState, states>(renderState)

    return mostService.callFunc(() => {
        let gl = getGL(states)

        console.log("tonemap for WebGL1")

        return renderState
    })
}
```
Utils
```ts
export function getState(states: states): state {
    //pipelineName来自YiRenderInMobilePipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自YiRenderInMobilePipelineStateType
        [pipelineName]: state
    })
}

//获得JiaRenderInMobilePipelineState的gl
export function getGL(states: states) {
    //jiaRenderInMobilePipelineName来自JiaRenderInMobilePipelineStateType
    return getExnFromStrictNull(states[jiaRenderInMobilePipelineName].gl)
}
```

这两个Job通过Utils的getGL函数获得JiaRenderInMobilePipelineState的gl；
而getGL函数是首先通过states获得JiaRenderInMobilePipelineState，然后再返回它的gl


这两个管道模块的Render Pipeline管道需要合并，我们回顾下Render的registerAllPipelines中合并这两个管道的相关代码：
Render
```ts
        let pipelineManagerState = registerPipeline(
            state.pipelineManagerState,
            getJiaRenderInMobilePipeline(),
            []
        )
        pipelineManagerState = registerPipeline(
            pipelineManagerState,
            getYiRenderInMobilePipeline(),
            [
                {
                    pipelineName: "render",
                    insertElementName: "init_webgl1_jia_renderInMobile",
                    insertAction: "after"
                }
            ]
        )
```

我们之前提到registerPipeline函数接收的第三个参数-JobOrders用来指定如何合并管道，它的类型定义如下：
PipelineManager->RegisterPipelineType
```ts
export type jobOrder = {
  //管道名
  pipelineName: pipelineName,
  //将该管道的所有Job插入到的element名（element可以为job或者group）
  insertElementName: elementName,
  //insertAction的值可以为before或者after，意思是插入到该element之前或者之后
  insertAction: insertAction,
}

//因为一个管道模块可以包括多个管道，所以jobOrders是数组，对应多个管道
export type jobOrders = Array<jobOrder>
```

<!-- 因为需要合并的两个RenderInMobilePipeline中都只有一个管道（名为render），所以jobOrders只包含一个jobOrder，对应名为render的管道 -->
因为这两个管道模块中都只有一个管道（Render Pipeline），所以jobOrders只包含一个jobOrder，对应该管道

这里具体是将YiRenderInMobilePipeline中Render Pipeline的两个Job放到JiaRenderInMobilePipeline中Render Pipeline的名为init_webgl1_jia_renderInMobile的Job（也就是InitWebGL1Job）之后执行，从而实现了在移动端只有一个Render Pipeline管道，该管道依次执行InitWebGL1Job、ForwardRenderJob、TonemapJob这三个Job

值得注意的是，合并后PipelineManagerState中仍然有这两个管道模块的PipelineState-JiaRenderInMobilePipelineState、YiRenderInMobilePipelineState





看完了移动端的两个管道模块的相关代码后，我们看下PC端的RenderInPCPipeline管道模块相关代码：
RenderInPCPipelineStateType
```ts
export const pipelineName = "RenderInPC"

export type state = {
    gl: WebGL2RenderingContext | null
}

export type states = {
    [pipelineName]: state,
}

```
RenderInPCPipeline
```ts
let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl2_renderInPC":
			return execInitWebGL2
		case "defer_render_renderInPC":
			return execDeferRender
		case "tonemap_renderInPC":
			return execTonemap
		default:
			return null
	}
}

export let getPipeline = (): pipeline<renderState, state> => {
	return {
		pipelineName: pipelineName,
		createState: renderState => {
			return {
				gl: null
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "render",
				groups: [
					{
						name: "first_renderInPC",
						link: "concat",
						elements: [
							{
								"name": "init_webgl2_renderInPC",
								"type_": "job"
							},
							{
								"name": "second_renderInPC",
								"type_": "group"
							},
						]
					},
					{
						name: "second_renderInPC",
						link: "concat",
						elements: [
							{
								"name": "defer_render_renderInPC",
								"type_": "job"
							},
							{
								"name": "tonemap_renderInPC",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_renderInPC"
			}
		],
	}
}
```

该管道中仍然只有一个Render Pipeline管道，它有三个Job：InitWebGL2Job、DeferRenderJob、TonemapJob

我们看下Job相关代码：
InitWebGL2Job
```ts
export let exec: execType<renderState> = (renderState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<renderState, states>(renderState)

	let canvas: HTMLCanvasElement = globalThis.canvas

	return mostService.callFunc(() => {
		console.log("初始化WebGL2")

		let gl = canvas.getContext("webgl2")

		return setStatesFunc<renderState, states>(
			renderState,
			setState(states, {
				...getState(states),
				gl: gl
			})
		)
	})
}
```
DeferRenderJob
```ts
export let exec: execType<renderState> = (renderState, { getStatesFunc }) => {
    let states = getStatesFunc<renderState, states>(renderState)
    let { gl } = getState(states)

    return mostService.callFunc(() => {
        gl = getExnFromStrictNull(gl)

        console.log("延迟渲染")

        return renderState
    })
}
```
TonemapJob
```ts
export let exec: execType<renderState> = (renderState, { getStatesFunc }) => {
    let states = getStatesFunc<renderState, states>(renderState)
    let { gl } = getState(states)

    return mostService.callFunc(() => {
        gl = getExnFromStrictNull(gl)

        console.log("tonemap for WebGL2")

        return renderState
    })
}
```
Utils
```ts
export function getState(states: states): state {
    //pipelineName来自RenderInPCPipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自RenderInPCPipelineStateType
        [pipelineName]: state
    })
}
```



我们介绍完了Render的registerAllPipelines和三个管道模块的相关代码，现在我们回到Client，看下剩余的代码：
```ts
render(renderState, canvas).then(newRenderState => {
    renderState = newRenderState
})
```

这里调用了Render的render函数来渲染，该函数返回了一个Promise

我们看下render相关代码：
Render
```ts
//从RenderState中获得PipelineManagerState
let _unsafeGetPipeManagerState = (state: state) => {
    return state.pipelineManagerState
}

//保存PipelineManagerState到RenderState中
let _setPipeManagerState = (state: state, pipelineManagerState: pipelineState) => {
    return {
        ...state,
        pipelineManagerState: pipelineManagerState
    }
}

let _runPipeline = (
    renderState: state,
    pipelineName: string
): Promise<state> => {
    let tempRenderState: state | null = null

    return mostService.map(
        (renderState: state) => {
            tempRenderState = renderState

            return renderState
        },
        //调用PipelineManager的runPipeline函数来运行管道
        runPipeline<state>(renderState, [
            unsafeGetState,
            setState,
            _unsafeGetPipeManagerState,
            _setPipeManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempRenderState)
    })
}

export let render = (state: state, canvas): Promise<state> => {
    //调用PipelineManager的init函数来初始化PipelineManager
    state = init(state, [_unsafeGetPipeManagerState, _setPipeManagerState])

    //将canvas保存到全局变量中，从而在初始化WebGL的Job中能够获得canvas
    globalThis.canvas = canvas

    //运行Render Pipeline管道
    return _runPipeline(state, "render")
}
```
PipelineManager
```ts
//PipelineManager是用Rescript实现的
//这里只给出PipelineManager相关函数的类型，没有给出具体实现代码
//这里的worldState具体就是指RenderState，而state是PipelineManagerState

type unsafeGetWorldState<worldState> = () => worldState

type setWorldState<worldState> = (worldState: worldState) => void

type unsafeGetPipelineManagerState<worldState> = (worldState: worldState) => state

type setPipelineManagerState<worldState> = (worldState: worldState, state: state) => worldState

export function runPipeline<worldState>(
    worldState: worldState,
    [
        unsafeGetWorldState,
        setWorldState,
        unsafeGetPipelineManagerState,
        setPipelineManagerState
    ]: [
            unsafeGetWorldState<worldState>,
            setWorldState<worldState>,
            unsafeGetPipelineManagerState<worldState>,
            setPipelineManagerState<worldState>
        ],
    pipelineName: pipelineName
): stream<worldState>

export function init<worldState>(worldState: worldState,
    [
        unsafeGetPipelineManagerState,
        setPipelineManagerState
    ]: [
            unsafeGetPipelineManagerState<worldState>,
            setPipelineManagerState<worldState>
        ],
): worldState
```

因为不管是PC端还是移动端，都只注册一个名为render的Render Pipeline管道，所以render函数只需运行这个管道，即可执行其中的三个Job，从而实现了渲染的逻辑




下面，我们运行代码，运行结果如下：
```text
is PC
初始化WebGL2
延迟渲染
tonemap for WebGL2
```

运行结果跟之前一样




<!-- # 设计意图

阐明模式的设计目标 -->

# 定义

## 一句话定义？

将有先后执行顺序的逻辑离散化为一个个独立的Job，按照配置数据在管道中依次执行

<!-- ## 补充说明
 -->


## 通用UML？

uml:
TODO tu

## 分析角色？


我们来看看模式的相关角色：


总体来看，分为System、PipelineManager、管道三个部分



我们看下Render、PipelineManager这两个部分：

- System
该角色是系统的门户，负责注册所有的管道，以及调用多个runPipelineX函数来运行对应的管道，依次执行它的Job

- PipelineManager
该角色负责管理管道，实现了注册管道、合并管道、运行管道的相关逻辑


我们看下管道这个部分：

- Pipeline
该角色是一个管道模块

<!-- 包括了多个管道，每个管道包括多个Job -->

- PipelineState
该角色保存了管道模块中所有管道的运行时数据

- PipelineStateType
该角色是PipelineState的类型

- X Pipeline
该角色是一个管道

- Job
该角色是一段独立的逻辑



## 角色之间的关系？

- System可以注册多个Pipeline

- 一个Pipeline有一个PipelineState和多个X Pipeline

- 一个PipelineState实现了一个PipelineStateType

- 一个X Pipeline有多个Job

- 每个Job都能读写所有的PipelineState，但它们没有直接依赖PipelineState，而是依赖它实现的PipelineStateType

- 如果一个Pipeline中的Job依赖了另一个Pipeline的PipelineState，那么该Pipeline的PipelineStateType就需要在states字段中依赖PipelineState的PipelineStateType


## 通用UML？

data_view:
TODO tu

## 分析角色？


<!-- 数据分为运行时数据和配置数据，其中各个State是运行时数据，各个JSON是配置数据 -->

Render有自己的数据-RenderState，它包括了其它的state

PipeManager有自己的数据-PipeStateManagerState，它包括了各个管道模块的PipelineState

三个管道模块各自有一个PipelineState数据和一个JSON配置数据，其中PipelineState保存了管道模块中所有管道的运行时数据，JSON配置数据用来指定管道模块中所有管道的Job的执行顺序



总体来看，数据分为运行时数据和配置数据，其中各个State是运行时数据，各个JSON是配置数据


System有自己的数据-SystemState，它包括了其它的state

PipeManager有自己的数据-PipeStateManagerState，它包括了所有管道模块的PipelineState

Pipeline有一个PipelineState数据和一个JSON配置数据，其中PipelineState保存了管道模块中所有管道的运行时数据，JSON配置数据用来指定管道模块中所有管道的Job的执行顺序


<!-- ## 角色之间的关系？ -->


## 角色的抽象代码？

TODO continue


## 遵循的设计原则在UML中的体现？




# 应用

## 优点

## 缺点

## 使用场景

TODO 系统的初始化、更新、渲染

### 场景描述

<!-- ### 解决方案 -->

### 具体案例

<!-- ## 实现该场景需要修改模式的哪些角色？ -->
<!-- ## 使用模式有什么好处？ -->

## 注意事项

<!-- ////TODO Job最好只写自己所属的管道的PipelineState，不是要写其它管道的PipelineState -->

# 扩展


TODO registerPipeline->config:
refactor Render->render:   //将canvas保存到全局变量中，从而在初始化WebGL的Job中能够获得canvas

TODO give 参考代码






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

TODO most.js doc?