import { getModelMatrixLength, getModelMatrixOffset, getPositionLength, getPositionOffset } from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getModelMatrixOffset(), getModelMatrixLength(count)),
        new Float32Array(buffer, getPositionOffset(count), getPositionLength(count))
    ]
}