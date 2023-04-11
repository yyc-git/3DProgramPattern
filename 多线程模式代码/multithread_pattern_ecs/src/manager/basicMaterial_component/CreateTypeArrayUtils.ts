import { getColorLength, getColorOffset } from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getColorOffset(count), getColorLength(count))
    ]
}