import { state } from "./RenderStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let tonemap = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInMobile.gl)

    console.log("tonemap for WebGL1")

    return state
}