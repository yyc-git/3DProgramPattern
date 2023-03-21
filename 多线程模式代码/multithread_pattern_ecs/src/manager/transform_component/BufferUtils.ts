let _getPositionSize = () => 3

export let getPositionOffset = (count) => 0

export let getPositionLength = (count) => count * _getPositionSize()

export let getPositionIndex = index => index * _getPositionSize()

let _getTotalByteLength = (count) => {
    return count * Float32Array.BYTES_PER_ELEMENT * _getPositionSize()
}

export let createBuffer = (count) => {
    return new ArrayBuffer(_getTotalByteLength(count))
}