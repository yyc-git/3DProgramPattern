import { getFloat1, setFloat1 } from "../TypeArrayUtils"
import { getVelocityIndex } from "./BufferUtils"

export let getVelocity = (index, typeArr) => {
    return getFloat1(getVelocityIndex(index), typeArr)
}

export let setVelocity = (index, data, typeArr) => {
    return setFloat1(getVelocityIndex(index), data, typeArr)
}