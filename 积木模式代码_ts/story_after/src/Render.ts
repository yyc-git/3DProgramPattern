import { state } from "./EngineStateType"
import * as Math from "./Math"
import * as SceneManager from "./SceneManager"

export let init = (state: state) => {
    console.log("初始化渲染")

    return state
}

export let render = (state: state) => {
    let allGameObjects = SceneManager.getAllGameObjects(state)

    console.log("处理场景数据")

    let _ = Math.multiplyMatrix(1, 2)

    console.log("渲染")

    return state
}