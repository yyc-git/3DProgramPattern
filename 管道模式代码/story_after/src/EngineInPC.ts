import { deferRender } from "./DeferRender"
import { initWebGL2 } from "./InitWebGL2"
import { state } from "./EngineStateType"
import { tonemap } from "./TonemapForWebGL2"

export let init = (state: state, canvas) => {
    state = initWebGL2(state, canvas)

    return state
}

export let render = (state: state) => {
    state = deferRender(state)
    state = tonemap(state)

    return state
}