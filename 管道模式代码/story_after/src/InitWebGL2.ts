import { state } from "./EngineStateType"

export let initWebGL2 = (state: state, canvas) => {
    console.log("初始化WebGL2")

    return {
        ...state,
        engineInPC: {
            gl: canvas.getContext("webgl2")
        }
    }
}