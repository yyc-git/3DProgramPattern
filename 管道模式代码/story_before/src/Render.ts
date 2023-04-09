import { state } from "./RenderStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _isPC = () => {
    return globalThis.isPC
}

let _initWebGL = (state, canvas) => {
    let gl = null

    if (_isPC()) {
        console.log("初始化WebGL2")

        gl = canvas.getContext("webgl2")
    }
    else {
        console.log("初始化WebGL1")

        gl = canvas.getContext("webgl1")
    }

    return {
        ...state,
        gl: gl
    }
}

let _render = (state) => {
    if (_isPC()) {
        let gl = getExnFromStrictNull(state.gl) as WebGL2RenderingContext

        console.log("延迟渲染")
    }
    else {
        let gl = getExnFromStrictNull(state.gl) as WebGLRenderingContext

        console.log("前向渲染")
    }

    return state
}

let _tonemap = (state) => {
    let gl = null

    if (_isPC()) {
        console.log("tonemap for WebGL2")

        gl = getExnFromStrictNull(state.gl) as WebGL2RenderingContext
    }
    else {
        console.log("tonemap for WebGL1")

        gl = getExnFromStrictNull(state.gl) as WebGLRenderingContext
    }

    return state
}

export let createState = (): state => {
    return {
        gl: null
    }
}

export let render = (state: state, canvas) => {
    console.log(globalThis.isPC ? "is PC" : "is mobile")

    state = _initWebGL(state, canvas)
    state = _render(state)
    state = _tonemap(state)

    return state
}