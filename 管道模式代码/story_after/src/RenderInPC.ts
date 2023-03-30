import { deferRender } from "./DeferRender"
import { initWebGL2 } from "./InitWebGL2"
import { state } from "./RenderStateType"
import { tonemap } from "./TonemapForWebGL2"

export let render = (state: state, canvas) => {
    state = initWebGL2(state, canvas)
    state = deferRender(state)
    state = tonemap(state)

    return state
}