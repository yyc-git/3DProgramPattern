import { forwardRender } from "./ForwardRender"
import { initWebGL1 } from "./InitWebGL1"
import { state } from "./RenderStateType"
import { tonemap } from "./TonemapForWebGL1"

export let render = (state: state, canvas) => {
    state = initWebGL1(state, canvas)
    state = forwardRender(state)
    state = tonemap(state)

    return state
}