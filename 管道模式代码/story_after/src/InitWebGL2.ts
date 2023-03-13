import { state } from "./RenderStateType"

export let initWebGL2 = (state: state, canvas) => {
    return {
        ...state,
        renderInPC: {
            gl: canvas.getContext("webgl2")
        }
    }
}