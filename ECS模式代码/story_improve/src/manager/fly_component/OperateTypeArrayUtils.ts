import { getFloat1, setFloat1 } from "../TypeArrayUtils"
import { getMaxVelocityIndex } from "./BufferUtils"

export let getMaxVelocity = (index, typeArr) => {
    return getFloat1(getMaxVelocityIndex(index), typeArr)
}

export let setMaxVelocity = (index, data, typeArr) => {
    return setFloat1(getMaxVelocityIndex(index), data, typeArr)
}