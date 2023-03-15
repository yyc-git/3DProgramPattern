import { state } from "./RenderStateType"

export let initWebGL2 = (state: state, canvas) => {
    console.log("初始化WebGL2")

    return {
        ...state,
        renderInPC: {
            gl: canvas.getContext("webgl2")
        }
    }
}