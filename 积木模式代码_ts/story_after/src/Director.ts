import * as SceneManager  from "./SceneManager"

import * as Render  from "./Render"
import { state as engineState } from "./EngineStateType"

export let createState = (): engineState => {
    return {
        scene: SceneManager.createState()
    }
}

export let init = (engineState) => {
    engineState = SceneManager.init(engineState)
    engineState = Render.init(engineState)

    return engineState
}

//假实现
let requestAnimationFrame = (func) => {
}

export let loop = (engineState: engineState) => {
    engineState = SceneManager.update(engineState)
    engineState = Render.render(engineState)

    requestAnimationFrame(
        (time) => {
            loop(engineState)
        }
    )
}