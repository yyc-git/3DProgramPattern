import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/OtherComponent1Type"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull, getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        maxUID: 0,
        value1Map: Map(),
        gameObjectMap: Map(),
        gameObjectOtherComponent1Map: Map(),
    }
}

export let createComponent = (state: state): [state, component] => {
    let uid = state.maxUID

    let newUID = uid + 1

    state = {
        ...state,
        maxUID: newUID
    }

    return [state, uid]
}

export let getComponentExn = (state: state, gameObject: gameObject): component => {
    let { gameObjectMap } = state

    return getExnFromStrictNull(gameObjectMap.get(gameObject))
}

export let setComponent = (state: state, gameObject: gameObject, component: component): state => {
    let { gameObjectMap, gameObjectOtherComponent1Map } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectOtherComponent1Map: gameObjectOtherComponent1Map.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectOtherComponent1Map } = state

    return gameObjectOtherComponent1Map.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectOtherComponent1Map } = state

    return gameObjectOtherComponent1Map.toArray().map(([key, value]) => value)
}

export let getValue1 = (state: state, component: component) => {
    return getExnFromStrictUndefined(state.value1Map.get(component))
}

export let setValue1 = (state: state, component: component, value1) => {
    return {
        ...state,
        value1Map: state.value1Map.set(component, value1)
    }
}

export let batchOperate = (state: state) => {
    let allComponents = getAllComponents(state)

    console.log("批量操作")

    return state
}