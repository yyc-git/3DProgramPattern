import { createState, init, render } from "render/src/Render"

//假canvas
let canvas = {
    getContext: (_) => 1 as any
}

// globalThis.isPC = true
globalThis.isPC = false


let renderState = createState()

renderState = init(renderState)

render(renderState, canvas).then(newRenderState => {
    // console.log(JSON.stringify(newRenderState), renderState)
    renderState = newRenderState
})