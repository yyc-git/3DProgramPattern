import { getVelocityLength, getVelocityOffset } from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getVelocityOffset(count), getVelocityLength(count))
    ]
}