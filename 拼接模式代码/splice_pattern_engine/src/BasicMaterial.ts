import { material, state } from "./BasicMaterialStateType"
import { Map } from "immutable"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        hasBasicMapMap: Map(),
        isSupportHardwareInstance: true,
        isSupportBatchInstance: false,
        colors: Map(),
        mapUnits: Map()
    }
}

export let createMaterial = (state: state): [state, material] => {
    let newMaterial = 0

    state = {
        ...state,
        hasBasicMapMap: state.hasBasicMapMap.set(newMaterial, false)
    }

    return [state, newMaterial]
}

export let hasBasicMap = (material: material, state: state) => {
    return state.hasBasicMapMap.has(material)
}

export let setFakeData = (state: state, material): state => {
    return {
        ...state,
        colors: state.colors.set(material, [1, 1, 0]),
        mapUnits: state.mapUnits.set(material, 0)
    }
}

export let getColor = (state: state, material) => {
    return getExnFromStrictNull(state.colors.get(material))
}

export let getMapUnit = (state: state, material) => {
    return getExnFromStrictNull(state.mapUnits.get(material))
}