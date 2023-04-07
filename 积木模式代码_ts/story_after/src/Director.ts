import { createState as createSceneManagerState, init as initScene, update as updateScene } from "./SceneManager"

import { init as initRender, render } from "./Render"
import { state as engineState } from "./EngineStateType"

export let createState = (): engineState => {
    return {
        scene: createSceneManagerState()
    }
}

export let init = (engineState) => {
    engineState = initScene(engineState)
    engineState = initRender(engineState)

    return engineState
}

//假实现
let requestAnimationFrame = (func) => {
}

export let loop = (engineState: engineState) => {
    engineState = updateScene(engineState)
    engineState = render(engineState)

    requestAnimationFrame(
        (time) => {
            loop(engineState)
        }
    )
}