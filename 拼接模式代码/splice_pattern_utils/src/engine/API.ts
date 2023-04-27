import * as GameObject from "./GameObject"
import * as BasicMaterial from "./BasicMaterial"
import * as PBRMaterial from "./PBRMaterial"
import * as Transform from "./Transform"
import { transform } from "./TransformStateType"
import * as BasicMaterialStateType from "./BasicMaterialStateType"
import * as PBRMaterialStateType from "./PBRMaterialStateType"
import * as InitCamera from "./InitCamera"
import { gameObject } from "./GameObjectStateType"

type state = any

export let createGameObject = (state: state): [state, gameObject] => {
    let gameObjectData = GameObject.createGameObject(state.gameObjectState)
    let gameObjectState = gameObjectData[0]
    let gameObject = gameObjectData[1]

    return [
        {
            ...state,
            gameObjectState: gameObjectState
        },
        gameObject
    ]
}

export let addMaterial = (state: state, gameObject, material, materialType): state => {
    let gameObjectState = GameObject.addMaterial(state.gameObjectState, gameObject, material, materialType)

    return {
        ...state,
        gameObjectState: gameObjectState
    }
}

export let addTransform = (state: state, gameObject, transform): state => {
    let gameObjectState = GameObject.addTransform(state.gameObjectState, gameObject, transform)

    return {
        ...state,
        gameObjectState: gameObjectState
    }
}

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

export let createBasicMaterial = (state: state): [state, BasicMaterialStateType.material] => {
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

export let setBasicMaterialFakeColor = (state: state, material: BasicMaterialStateType.material): state => {
    let basicMaterialState = BasicMaterial.setFakeColor(state.basicMaterialState, material)

    return {
        ...state,
        basicMaterialState: basicMaterialState
    }
}

export let setBasicMaterialFakeMap = (state: state, material: BasicMaterialStateType.material): state => {
    let basicMaterialState = BasicMaterial.setFakeMap(state.basicMaterialState, material)

    return {
        ...state,
        basicMaterialState: basicMaterialState
    }
}

export let createPBRMaterial = (state: state): [state, PBRMaterialStateType.material] => {
    let materialData = PBRMaterial.createMaterial(state.pbrMaterialState)
    let pbrMaterialState = materialData[0]
    let material = materialData[1]

    return [
        {
            ...state,
            pbrMaterialState: pbrMaterialState
        },
        material
    ]
}

export let initCamera = InitCamera.initCamera