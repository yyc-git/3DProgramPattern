import * as BufferUtils from "./BufferUtils"

export let createTypeArrays = (buffer, count) => {
    return [
        new Float32Array(buffer, BufferUtils.getPositionOffset(count), BufferUtils.getPositionLength(count))
    ]
}