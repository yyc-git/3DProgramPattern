import { getValue1Length, getValue2Length, getValue1Offset, getValue2Offset } from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, getValue1Offset(), getValue1Length(count)),
        new Float32Array(buffer, getValue2Offset(count), getValue2Length(count)),
    ]
}