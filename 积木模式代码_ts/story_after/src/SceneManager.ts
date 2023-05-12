import { state } from "./EngineStateType"
import * as Math from "./Math"
import { state as sceneManagerState } from "./SceneManagerStateType"

export let createState = (): sceneManagerState => {
    return { allGameObjects: [] }
}

export let createScene = (state: state) => {
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

export let getAllGameObjects = (state: state) => {
    return state.scene.allGameObjects
}

export let init = (state: state) => {
    console.log("初始化场景")

    return state
}

export let update = (state: state) => {
    console.log("更新场景")

    let _ = Math.multiplyMatrix(1, 2)

    return state
}