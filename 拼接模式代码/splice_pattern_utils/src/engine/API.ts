import * as BasicMaterial from "./BasicMaterial"
import * as Transform from "./Transform"
import { transform } from "./TransformStateType"
import { material } from "./BasicMaterialStateType"
import * as InitCamera from "./InitCamera"

type state = any

export let createTransform = (state: state): [state, transform] => {
    let transformData = Transform.createTransform(state.transformState)
    let transformState = transformData[0]
    let transform = transformData[1]

    return [
        {
            ...state,
            transformState: transformState
        },
        transform
    ]
}

export let setFakeTransformData = (state: state, transform: transform): state => {
    let transformState = Transform.setFakeData(state.transformState, transform)

    return {
        ...state,
        transformState: transformState
    }
}

export let createMaterial = (state: state): [state, material] => {
    let materialData = BasicMaterial.createMaterial(state.basicMaterialState)
    let basicMaterialState = materialData[0]
    let material = materialData[1]

    return [
        {
            ...state,
            basicMaterialState: basicMaterialState
        },
        material
    ]
}

export let setMaterialFakeColor = (state: state, material: material): state => {
    let basicMaterialState = BasicMaterial.setFakeColor(state.basicMaterialState, material)

    return {
        ...state,
        basicMaterialState: basicMaterialState
    }
}

export let setMaterialFakeMap = (state: state, material: material): state => {
    let basicMaterialState = BasicMaterial.setFakeMap(state.basicMaterialState, material)

    return {
        ...state,
        basicMaterialState: basicMaterialState
    }
}

export let initCamera = InitCamera.initCamera