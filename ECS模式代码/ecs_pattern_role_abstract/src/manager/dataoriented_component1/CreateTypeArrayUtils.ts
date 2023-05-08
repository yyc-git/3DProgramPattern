import * as BufferUtils from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, BufferUtils.getValue1Offset(), BufferUtils.getValue1Length(count)),
        new Float32Array(buffer, BufferUtils.getValue2Offset(count), BufferUtils.getValue2Length(count)),
    ]
}