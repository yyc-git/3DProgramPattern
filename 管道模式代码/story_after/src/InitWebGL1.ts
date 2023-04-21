import { state } from "./EngineStateType"

export let initWebGL1 = (state: state, canvas) => {
    console.log("初始化WebGL1")

    return {
        ...state,
        engineInMobile: {
            gl: canvas.getContext("webgl1")
        }
    }
}