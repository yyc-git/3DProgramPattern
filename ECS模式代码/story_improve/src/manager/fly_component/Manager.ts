import { createBuffer } from "./BufferUtils"
import { createTypeArrays } from "./CreateTypeArrayUtils"
import { range } from "commonlib-ts/src/ArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/FlyComponentType"
import * as OperateTypeArrayUtils from "./OperateTypeArrayUtils"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _setAllTypeArrDataToDefault = ([maxVelocitys]: Array<Float32Array>, count, [defaultMaxVelocity]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setMaxVelocity(index, defaultMaxVelocity, maxVelocitys)
    })

    return [maxVelocitys]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<Float32Array>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (flyComponentCount: number): state => {
    let defaultMaxVelocity = 10.0

    let [buffer, [maxVelocitys]] = _initBufferData(flyComponentCount, [defaultMaxVelocity])

    return {
        maxIndex: 0,
        buffer,
        maxVelocitys,
        gameObjectMap: Map(),
        gameObjectFlyMap: Map(),
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
    let { gameObjectMap, gameObjectFlyMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectFlyMap: gameObjectFlyMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectFlyMap } = state

    return gameObjectFlyMap.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectFlyMap } = state

    return gameObjectFlyMap.toArray().map(([key, value]) => value)
}

export let getMaxVelocity = (state: state, component: component) => {
    return OperateTypeArrayUtils.getMaxVelocity(component, state.maxVelocitys)
}

export let setMaxVelocity = (state: state, component: component, fly) => {
    OperateTypeArrayUtils.setMaxVelocity(component, fly, state.maxVelocitys)

    return state
}