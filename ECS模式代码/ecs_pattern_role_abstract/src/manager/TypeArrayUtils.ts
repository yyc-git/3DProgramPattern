export let getFloat1 = (index, typeArray) => {
    return typeArray[index]
}

export let setFloat1 = (index, float, typeArray) => {
    typeArray[index] = float
}

export let getFloat3Tuple = (index, typeArray) => {
    return [
        typeArray[index],
        typeArray[index + 1 | 0],
        typeArray[index + 2 | 0]
    ]
}

export let setFloat3 = (index, param, typeArray) => {
    typeArray[index] = param[0]
    typeArray[index + 1 | 0] = param[1]
    typeArray[index + 2 | 0] = param[2]
}
