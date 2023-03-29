import { material, state } from "./BasicMaterialStateType"
import { Map } from "immutable"
import { getExnFromStrictNull, getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        maxMaterialIndex: 0,
        shaderIndexMap: Map(),
        hasBasicMapMap: Map(),
        colors: Map(),
        mapUnits: Map()
    }
}

export let createMaterial = (state: state): [state, material] => {
    let newMaterial = state.maxMaterialIndex

    state = {
        ...state,
        maxMaterialIndex: state.maxMaterialIndex + 1,
        hasBasicMapMap: state.hasBasicMapMap.set(newMaterial, false)
    }

    state = setFakeColor(state, newMaterial)

    return [state, newMaterial]
}

export let hasBasicMap = (material: material, state: state) => {
    return getExnFromStrictUndefined(state.hasBasicMapMap.get(material))
}

export let getColor = (state: state, material) => {
    return getExnFromStrictNull(state.colors.get(material))
}

export let setFakeColor = (state: state, material): state => {
    return {
        ...state,
        colors: state.colors.set(material, [1, 1, 0]),
    }
}

export let getMapUnit = (state: state, material) => {
    return getExnFromStrictNull(state.mapUnits.get(material))
}

export let setFakeMap = (state: state, material): state => {
    return {
        ...state,
        hasBasicMapMap: state.hasBasicMapMap.set(material, true),
        mapUnits: state.mapUnits.set(material, 0)
    }
}


export let getShaderIndex = (state: state, material) => {
    return getExnFromStrictNull(state.shaderIndexMap.get(material))
}

export let setShaderIndex = (state: state, material, shaderIndex) => {
    return {
        ...state,
        shaderIndexMap: state.shaderIndexMap.set(material, shaderIndex)
    }
}