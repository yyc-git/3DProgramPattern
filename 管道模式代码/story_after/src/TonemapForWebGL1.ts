import { state } from "./EngineStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let tonemap = (state: state) => {
    let gl = getExnFromStrictNull(state.engineInMobile.gl)

    console.log("tonemap for WebGL1")

    return state
}