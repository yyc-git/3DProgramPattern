import { getFloat3Tuple, setFloat3 } from "../TypeArrayUtils"
import { getColorIndex } from "./BufferUtils"

export let getColor = (index, typeArr) => {
    return getFloat3Tuple(getColorIndex(index), typeArr)
}

export let setColor = (index, data, typeArr) => {
    return setFloat3(getColorIndex(index), data, typeArr)
}