import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/InstanceComponentType"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        maxIndex: 0,
        gameObjectMap: Map(),
        gameObjectInstanceMap: Map(),
    }
}

export let createComponent = (state: state): [state, component] => {
    let index = state.maxIndex

    let newIndex = index + 1

    state = {
        ...state,
        maxIndex: newIndex
    }

    return [state, index]
}

export let getComponentExn = (state: state, gameObject: gameObject): component => {
    let { gameObjectMap } = state

    return getExnFromStrictNull(gameObjectMap.get(gameObject))
}

export let setComponent = (state: state, gameObject: gameObject, component: component): state => {
    let { gameObjectMap, gameObjectInstanceMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectInstanceMap: gameObjectInstanceMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectInstanceMap } = state

    return gameObjectInstanceMap.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectInstanceMap } = state

    return gameObjectInstanceMap.toArray().map(([key, value]) => value)
}