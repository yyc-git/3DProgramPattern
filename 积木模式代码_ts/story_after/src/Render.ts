import { state as engineState } from "./EngineStateType"
import * as Math from "./Math"
import * as SceneManager from "./SceneManager"

export let init = (engineState: engineState) => {
    console.log("初始化渲染")

    return engineState
}

export let render = (engineState: engineState) => {
    let allGameObjects = SceneManager.getAllGameObjects(engineState)

    console.log("处理场景数据")

    let _ = Math.multiplyMatrix(1, 2)

    console.log("渲染")

    return engineState
}