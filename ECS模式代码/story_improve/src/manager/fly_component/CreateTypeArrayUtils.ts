import { getMaxVelocityLength, getMaxVelocityOffset } from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getMaxVelocityOffset(count), getMaxVelocityLength(count))
    ]
}