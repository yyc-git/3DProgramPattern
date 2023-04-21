import { state } from "./EngineStateType"
import * as EngineInPC from "./EngineInPC"
import * as EngineInMobile from "./EngineInMobile"

let _isPC = () => {
    return globalThis.isPC
}

export let createState = (): state => {
    return {
        engineInPC: {
            gl: null
        },
        engineInMobile: {
            gl: null
        }
    }
}

export let init = (state: state, canvas) => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    if (_isPC()) {
        state = EngineInPC.init(state, canvas)
    }
    else {
        state = EngineInMobile.init(state, canvas)
    }

    return state
}

export let render = (state: state) => {
    if (_isPC()) {
        state = EngineInPC.render(state)
    }
    else {
        state = EngineInMobile.render(state)
    }

    return state
}