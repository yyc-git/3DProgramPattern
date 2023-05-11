import * as DeferRender from "./DeferRender"
import * as InitWebGL2 from "./InitWebGL2"
import { state } from "./EngineStateType"
import * as TonemapForWebGL2 from "./TonemapForWebGL2"

export let init = (state: state, canvas) => {
    state = InitWebGL2.initWebGL2(state, canvas)

    return state
}

export let render = (state: state) => {
    state = DeferRender.deferRender(state)
    state = TonemapForWebGL2.tonemap(state)

    return state
}