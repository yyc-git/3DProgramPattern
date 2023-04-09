import { state } from "./RenderStateType"
import { render as renderInPC } from "./RenderInPC"
import { render as renderInMobile } from "./RenderInMobile"

let _isPC = () => {
    return globalThis.isPC
}

export let createState = (): state => {
    return {
        renderInPC: {
            gl: null
        },
        renderInMobile: {
            gl: null
        }
    }
}

export let render = (state: state, canvas) => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    if (_isPC()) {
        state = renderInPC(state, canvas)
    }
    else {
        state = renderInMobile(state, canvas)
    }

    return state
}