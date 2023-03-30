import { state } from "./RenderStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let forwardRender = (state: state) => {
    let gl = getExnFromStrictNull(state.renderInMobile.gl)

    console.log("前向渲染")

    return state
}