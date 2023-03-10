import { multiplyMatrix } from "./Math"
import { state as sceneManagerState } from "./SceneManagerStateType"
import { state as engineState } from "./EngineStateType"

export let createState = (): sceneManagerState => {
    return { allGameObjects: [] }
}

export let createScene = (state: engineState) => {
    // console.log("创建场景，包括创建GameObject, Material等")
    console.log("创建场景")

    // let gameObject1: any = 1
    // let gameObject2: any = 2

    let sceneGameObject = 1

    return {
        ...state,
        scene: {
            ...state.scene,
            // allGameObjects: [gameObject1, gameObject2]

            //通过concat而不是push来加入，保持state的immutable
            allGameObjects: state.scene.allGameObjects.concat([sceneGameObject])
        }
    }
}

export let getAllGameObjects = (state: engineState) => {
    return state.scene.allGameObjects
}

export let init = (state: engineState) => {
    // let state = _createState()

    console.log("初始化场景")

    return state
}

export let update = (state: engineState) => {
    console.log("更新场景")

    let _ = multiplyMatrix(1, 2)

    return state
}