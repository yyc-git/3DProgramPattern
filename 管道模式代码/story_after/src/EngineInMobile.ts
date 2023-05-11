import * as  ForwardRender from "./ForwardRender"
import * as InitWebGL1 from "./InitWebGL1"
import { state } from "./EngineStateType"
import * as TonemapForWebGL1 from "./TonemapForWebGL1"

export let init = (state: state, canvas) => {
    state = InitWebGL1.initWebGL1(state, canvas)

    return state
}

export let render = (state: state) => {
    state = ForwardRender.forwardRender(state)
    state = TonemapForWebGL1.tonemap(state)

    return state
}