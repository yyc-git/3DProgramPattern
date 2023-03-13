import { state } from "./RenderStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let tonemap = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInPC.gl)

    console.log("tonemap")

    return state
}