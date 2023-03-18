import { createBuffer } from "./BufferUtils"
import { createTypeArrays } from "./CreateTypeArrayUtils"
import { range } from "commonlib-ts/src/ArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/VelocityComponentType"
import * as OperateTypeArrayUtils from "./OperateTypeArrayUtils"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _setAllTypeArrDataToDefault = ([velocitys]: Array<Float32Array>, count, [defaultVelocity]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setVelocity(index, defaultVelocity, velocitys)
    })

    return [velocitys]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<Float32Array>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (velocityComponentCount: number): state => {
    let defaultVelocity = 1.0

    let [buffer, [velocitys]] = _initBufferData(velocityComponentCount, [defaultVelocity])

    return {
        maxIndex: 0,
        buffer,
        velocitys,
        gameObjectMap: Map(),
        gameObjectVelocityMap: Map(),
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
    let { gameObjectMap, gameObjectVelocityMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectVelocityMap: gameObjectVelocityMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectVelocityMap } = state

    return gameObjectVelocityMap.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectVelocityMap } = state

    return gameObjectVelocityMap.toArray().map(([key, value]) => value)
}

export let getVelocity = (state: state, component: component) => {
    return OperateTypeArrayUtils.getVelocity(component, state.velocitys)
}

export let setVelocity = (state: state, component: component, velocity) => {
    OperateTypeArrayUtils.setVelocity(component, velocity, state.velocitys)

    return state
}