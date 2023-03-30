import { getPositionLength, getPositionOffset } from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getPositionOffset(count), getPositionLength(count))
    ]
}