import { transform, state } from "./TransformStateType"
import { Map } from "immutable"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        modelMatrixs: Map(),
    }
}

export let createTransform = (state: state): [state, transform] => {
    let newTransform = 0

    return [state, newTransform]
}

export let setFakeData = (state: state, transform): state => {
    return {
        ...state,
        modelMatrixs: state.modelMatrixs.set(transform,
            new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0])
        ),
    }
}

export let getModelMatrix = (state: state, transform) => {
    return getExnFromStrictNull(state.modelMatrixs.get(transform))
}