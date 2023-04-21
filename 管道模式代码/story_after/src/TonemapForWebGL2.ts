import { state } from "./EngineStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let tonemap = (state: state) => {
    let gl = getExnFromStrictNull(state.engineInPC.gl)

    console.log("tonemap for WebGL2")

    return state
}