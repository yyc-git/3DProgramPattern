import { createTypeArrays } from "./CreateTypeArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"

let _initBufferData = (count, buffer): Array<Float32Array> => {
    let typeArrData = createTypeArrays(buffer, count)

    return typeArrData
}

export let createState = (basicMaterialComponentCount: number, buffer: SharedArrayBuffer): state => {
    let [colors] = _initBufferData(basicMaterialComponentCount, buffer)

    return {
        maxIndex: 0,
        buffer,
        colors,
        gameObjectMap: Map(),
        gameObjectBasicMaterialMap: Map(),
    }
}
