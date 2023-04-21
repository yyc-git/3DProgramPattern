import { createState, init, registerAllPipelines, render } from "engine/src/Engine"

//构造假canvas
let canvas = {
    getContext: (_) => 1 as any
}

//此处设置运行环境为PC端
//也可以通过设置为false来设置运行环境为移动端 
globalThis.isPC = true

let engineState = createState()

engineState = registerAllPipelines(engineState)

init(engineState, canvas).then(engineState => {
    render(engineState).then(engineState => {
    })
})