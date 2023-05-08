import * as TypeArrayUtils from "../TypeArrayUtils"
import * as BufferUtils from "./BufferUtils"

export let getPosition = (index, typeArr) => {
    return TypeArrayUtils.getFloat3Tuple(BufferUtils.getPositionIndex(index), typeArr)
}

export let setPosition = (index, data, typeArr) => {
    TypeArrayUtils.setFloat3(BufferUtils.getPositionIndex(index), data, typeArr)
}