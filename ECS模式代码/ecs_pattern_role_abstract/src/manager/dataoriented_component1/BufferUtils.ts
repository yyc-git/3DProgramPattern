// 这里只给出了两个value的情况
// 更多的value也以此类推...

let _getValue1Size = () => value1 size

let _getValue2Size = () => value2 size

export let getValue1Offset = () => 0

export let getValue2Offset = (count) => getValue1Offset() + getValue1Length(count) * TypeArray2.BYTES_PER_ELEMENT

export let getValue1Length = (count) => count * _getValue1Size()

export let getValue2Length = (count) => count * _getValue2Size()

export let getValue1Index = index => index * _getValue1Size()

export let getValue2Index = index => index * _getValue2Size()

let _getTotalByteLength = (count) => {
    return count * (TypeArray1.BYTES_PER_ELEMENT * (_getValue1Size() + TypeArray2.BYTES_PER_ELEMENT * (_getValue2Size())))
}

export let createBuffer = (count) => {
    return new ArrayBuffer(_getTotalByteLength(count))
}