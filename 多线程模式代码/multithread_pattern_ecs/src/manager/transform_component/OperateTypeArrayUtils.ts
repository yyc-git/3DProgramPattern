import { getFloat16TypeArray, getFloat3Tuple, setFloat16, setFloat3 } from "../TypeArrayUtils"
import { getModelMatrixIndex, getPositionIndex } from "./BufferUtils"

export let getModelMatrixTypeArray = (index, typeArr) => {
    return getFloat16TypeArray(getModelMatrixIndex(index), typeArr)
}


export let setModelMatrix = (index, modelMatrix, typeArr) => {
    setFloat16(getModelMatrixIndex(index), modelMatrix, typeArr)
}


export let setModelMatrixByPosition = (index, [x, y, z], typeArr) => {
    index = getModelMatrixIndex(index)

    typeArr[index + 12 | 0] = x
    typeArr[index + 13 | 0] = y
    typeArr[index + 14 | 0] = z
}

export let getPosition = (index, typeArr) => {
    return getFloat3Tuple(getPositionIndex(index), typeArr)
}

export let setPosition = (index, data, typeArr) => {
    setFloat3(getPositionIndex(index), data, typeArr)
}