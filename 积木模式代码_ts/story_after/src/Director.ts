import { state } from "./EngineStateType"
import * as SceneManager  from "./SceneManager"
import * as Render  from "./Render"

export let createState = (): state => {
    return {
        scene: SceneManager.createState()
    }
}

export let init = (state) => {
    state = SceneManager.init(state)
    state = Render.init(state)

    return state
}

//假实现
let requestAnimationFrame = (func) => {
}

export let loop = (state: state) => {
    state = SceneManager.update(state)
    state = Render.render(state)

    requestAnimationFrame(
        (time) => {
            loop(state)
        }
    )
}