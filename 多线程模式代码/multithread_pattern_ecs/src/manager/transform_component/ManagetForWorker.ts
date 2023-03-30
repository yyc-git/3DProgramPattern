import { createTypeArrays } from "./CreateTypeArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"

let _initBufferData = (count, buffer): Array<Float32Array> => {
    let typeArrData = createTypeArrays(buffer, count)

    return typeArrData
}

export let createState = (transformComponentCount: number, buffer: SharedArrayBuffer): state => {
    let [modelMatrices, positions] = _initBufferData(transformComponentCount, buffer)

    return {
        maxIndex: 0,
        buffer,
        modelMatrices,
        positions,
        gameObjectMap: Map(),
        gameObjectTransformMap: Map(),
    }
}
