import { createState, render } from "./Render"

//假canvas
let canvas = {
    getContext: (_) => 1 as any
}

globalThis.isPC = true


let renderState = createState()

renderState = render(renderState, canvas)