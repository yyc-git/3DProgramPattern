let _getModelMatrixSize = () => 16

export let getModelMatrixOffset = () => 0

export let getModelMatrixLength = (count) => count * _getModelMatrixSize()

export let getModelMatrixIndex = index => index * _getModelMatrixSize()

let _getPositionSize = () => 3

export let getPositionOffset = (count) => getModelMatrixOffset() + getModelMatrixLength(count) * Float32Array.BYTES_PER_ELEMENT

export let getPositionLength = (count) => count * _getPositionSize()

export let getPositionIndex = index => index * _getPositionSize()


let _getTotalByteLength = (count) => {
    return count * Float32Array.BYTES_PER_ELEMENT * (_getModelMatrixSize() + _getPositionSize())
}

export let createBuffer = (count) => {
    // return new ArrayBuffer(_getTotalByteLength(count))
    return new SharedArrayBuffer(_getTotalByteLength(count))
}