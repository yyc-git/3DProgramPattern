import { state } from "./RenderStateType"

export let initWebGL1 = (state: state, canvas) => {
    console.log("初始化WebGL1")

    return {
        ...state,
        renderInMobile: {
            gl: canvas.getContext("webgl1")
        }
    }
}