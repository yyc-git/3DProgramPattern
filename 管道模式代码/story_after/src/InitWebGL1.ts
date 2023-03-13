import { state } from "./RenderStateType"

export let initWebGL1 = (state: state, canvas) => {
    return {
        ...state,
        renderInMobile: {
            gl: canvas.getContext("webgl1")
        }
    }
}