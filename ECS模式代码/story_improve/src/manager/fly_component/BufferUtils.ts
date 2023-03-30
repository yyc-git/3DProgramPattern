let _getMaxVelocitySize = () => 1

export let getMaxVelocityOffset = (count) => 0

export let getMaxVelocityLength = (count) => count * _getMaxVelocitySize()

export let getMaxVelocityIndex = index => index * _getMaxVelocitySize()

let _getTotalByteLength = (count) => {
    return count * Float32Array.BYTES_PER_ELEMENT * _getMaxVelocitySize()
}

export let createBuffer = (count) => {
    return new ArrayBuffer(_getTotalByteLength(count))
}