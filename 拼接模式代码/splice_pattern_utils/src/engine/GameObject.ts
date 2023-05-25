import { gameObject, state } from "./GameObjectStateType"
import { Map } from "immutable"
import { material, materialType } from "./MaterialType"
import { transform } from "./TransformStateType"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { range } from "commonlib-ts/src/ArrayUtils";

export let createState = (): state => {
    return {
        maxUID: 0,
        gameObjectMaterialMap: Map(),
        gameObjectTransformMap: Map(),
    }
}

export let createGameObject = (state: state): [state, gameObject] => {
    let newGameObject = state.maxUID

    state = {
        ...state,
        maxUID: state.maxUID + 1
    }

    return [state, newGameObject]
}


export let addMaterial = (state: state, gameObject: gameObject, material: material, materialType: materialType): state => {
    return {
        ...state,
        gameObjectMaterialMap: state.gameObjectMaterialMap.set(gameObject, [material, materialType])
    }
}

export let addTransform = (state: state, gameObject: gameObject, transform: transform): state => {
    return {
        ...state,
        gameObjectTransformMap: state.gameObjectTransformMap.set(gameObject, transform)
    }
}

export let getMaterial = (state: state, gameObject: gameObject) => {
    return getExnFromStrictUndefined(state.gameObjectMaterialMap.get(gameObject))
}

export let getTransform = (state: state, gameObject: gameObject) => {
    return getExnFromStrictUndefined(state.gameObjectTransformMap.get(gameObject))
}

export let getAllGameObjects = (state:state) => {
    let { maxUID } = state

    return range(0, maxUID - 1)
}