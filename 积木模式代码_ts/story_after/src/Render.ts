import { state as engineState } from "./EngineStateType"
import { multiplyMatrix } from "./Math"
import { getAllGameObjects } from "./SceneManager"

export let init = (engineState: engineState) => {
    console.log("初始化渲染")

    return engineState
}

export let render = (engineState: engineState) => {
    let allGameObjects = getAllGameObjects(engineState)

    console.log("处理场景数据")

    let _ = multiplyMatrix(1, 2)

    console.log("渲染")

    return engineState
}