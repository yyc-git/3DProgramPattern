import { createState, render } from "./Render"

//假canvas
let canvas = {
    getContext: (_) => 1 as any
}

//指定运行环境
globalThis.isPC = true


let renderState = createState()

renderState = render(renderState, canvas)