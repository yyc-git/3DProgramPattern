let _getVelocitySize = () => 1

export let getVelocityOffset = (count) => 0

export let getVelocityLength = (count) => count * _getVelocitySize()

export let getVelocityIndex = index => index * _getVelocitySize()

let _getTotalByteLength = (count) => {
    return count * Float32Array.BYTES_PER_ELEMENT * _getVelocitySize()
}

export let createBuffer = (count) => {
    return new ArrayBuffer(_getTotalByteLength(count))
}