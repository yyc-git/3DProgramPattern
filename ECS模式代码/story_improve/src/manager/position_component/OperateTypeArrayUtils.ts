import { getFloat3Tuple, setFloat3 } from "../TypeArrayUtils"
import { getPositionIndex } from "./BufferUtils"

export let getPosition = (index, typeArr) => {
    return getFloat3Tuple(getPositionIndex(index), typeArr)
}

export let setPosition = (index, data, typeArr) => {
    return setFloat3(getPositionIndex(index), data, typeArr)
}