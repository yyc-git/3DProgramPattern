import { createTypeArrays } from "./CreateTypeArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"

let _initBufferData = (count, buffer): Array<Float32Array> => {
    let typeArrData = createTypeArrays(buffer, count)

    return typeArrData
}

export let createState = (noLightMaterialComponentCount: number, buffer: SharedArrayBuffer): state => {
    let [colors] = _initBufferData(noLightMaterialComponentCount, buffer)

    return {
        maxIndex: 0,
        buffer,
        colors,
        gameObjectMap: Map(),
        gameObjectNoLightMaterialMap: Map(),
    }
}
