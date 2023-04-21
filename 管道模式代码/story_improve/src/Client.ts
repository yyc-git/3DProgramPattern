import { createState, registerAllPipelines, render } from "render/src/Render"

//构造假canvas
let canvas = {
    getContext: (_) => 1 as any
}

//此处设置运行环境为PC端
//也可以通过设置为false来设置运行环境为移动端 
globalThis.isPC = true

let renderState = createState()

renderState = registerAllPipelines(renderState)

render(renderState, canvas).then(newRenderState => {
    // console.log(JSON.stringify(newRenderState), renderState)
    renderState = newRenderState
})