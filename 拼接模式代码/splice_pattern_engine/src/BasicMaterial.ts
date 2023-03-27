import { material, state } from "./BasicMaterialStateType"
import { Map } from "immutable"

export let createState = (): state => {
    return {
        hasBasicMapMap: Map(),
        isSupportHardwareInstance: true,
        isSupportBatchInstance: false
    }
}

export let createMaterial = (state: state): [state, material] => {
    let newMaterial = 1

    state = {
        ...state,
        hasBasicMapMap: state.hasBasicMapMap.set(newMaterial, false)
    }

    return [state, newMaterial]
}

export let hasBasicMap = (material: material, state: state) => {
    return state.hasBasicMapMap.has(material)
}

