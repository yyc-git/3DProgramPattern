import { forwardRender } from "./ForwardRender"
import { initWebGL1 } from "./InitWebGL1"
import { state } from "./EngineStateType"
import { tonemap } from "./TonemapForWebGL1"

export let init = (state: state, canvas) => {
    state = initWebGL1(state, canvas)

    return state
}

export let render = (state: state) => {
    state = forwardRender(state)
    state = tonemap(state)

    return state
}