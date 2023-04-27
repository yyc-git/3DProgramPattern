import { material, state } from "./PBRMaterialStateType"
import { Map } from "immutable"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        maxMaterialIndex: 0,
        hasDiffuseMapMap: Map(),
        diffuses: Map(),
        diffuseMapUnits: Map()
    }
}

export let createMaterial = (state: state): [state, material] => {
    let newMaterial = state.maxMaterialIndex

    state = {
        ...state,
        maxMaterialIndex: state.maxMaterialIndex + 1,
        hasDiffuseMapMap: state.hasDiffuseMapMap.set(newMaterial, false)
    }

    state = setFakeDiffuse(state, newMaterial)

    return [state, newMaterial]
}

export let hasDiffuseMap = (state: state, material: material) => {
    return getExnFromStrictUndefined(state.hasDiffuseMapMap.get(material))
}

export let getDiffuse = (state: state, material) => {
    return getExnFromStrictUndefined(state.diffuses.get(material))
}

export let setFakeDiffuse = (state: state, material): state => {
    return {
        ...state,
        diffuses: state.diffuses.set(material, [1, 1, 0]),
    }
}

export let getDiffuseMapUnit = (state: state, material) => {
    return getExnFromStrictUndefined(state.diffuseMapUnits.get(material))
}

export let setFakeDiffuseMap = (state: state, material): state => {
    return {
        ...state,
        hasDiffuseMapMap: state.hasDiffuseMapMap.set(material, true),
        diffuseMapUnits: state.diffuseMapUnits.set(material, 0)
    }
}