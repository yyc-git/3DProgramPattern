import { getValue1FromTypeArray1, getValue2FromTypeArray2, setValue1ToTypeArray1, setValue2ToTypeArray2 } from "../TypeArrayUtils"
import { getValue1Index, getValue2Index } from "./BufferUtils"

export let getValue1 = (index, typeArr) => {
    return getValue1FromTypeArray1(getValue1Index(index), typeArr)
}

export let setValue1 = (index, data, typeArr) => {
    setValue1ToTypeArray1(getValue1Index(index), data, typeArr)
}

export let getValue2 = (index, typeArr) => {
    return getValue2FromTypeArray2(getValue2Index(index), typeArr)
}

export let setValue2 = (index, data, typeArr) => {
    setValue2ToTypeArray2(getValue2Index(index), data, typeArr)
}