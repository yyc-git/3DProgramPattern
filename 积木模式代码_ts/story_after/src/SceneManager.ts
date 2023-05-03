import * as Math from "./Math"
import { state as sceneManagerState } from "./SceneManagerStateType"
import { state as engineState } from "./EngineStateType"

export let createState = (): sceneManagerState => {
    return { allGameObjects: [] }
}

export let createScene = (state: engineState) => {
    console.log("创建场景")

    //创建一个假的gameObject
    let sceneGameObject = 1

    return {
        ...state,
        scene: {
            ...state.scene,
            //通过concat而不是push来加入，保持immutable
            allGameObjects: state.scene.allGameObjects.concat([sceneGameObject])
        }
    }
}

export let getAllGameObjects = (state: engineState) => {
    return state.scene.allGameObjects
}

export let init = (state: engineState) => {
    console.log("初始化场景")

    return state
}

export let update = (state: engineState) => {
    console.log("更新场景")

    let _ = Math.multiplyMatrix(1, 2)

    return state
}