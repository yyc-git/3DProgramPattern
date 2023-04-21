import { state } from "./EngineStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let deferRender = (state: state) => {
    let gl = getExnFromStrictNull(state.engineInPC.gl)

    console.log("延迟渲染")

    return state
}