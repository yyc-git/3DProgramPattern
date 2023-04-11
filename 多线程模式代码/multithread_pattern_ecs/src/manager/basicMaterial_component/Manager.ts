import { createBuffer } from "./BufferUtils"
import { createTypeArrays } from "./CreateTypeArrayUtils"
import { range } from "commonlib-ts/src/ArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/BasicMaterialComponentType"
import * as OperateTypeArrayUtils from "./OperateTypeArrayUtils"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _setAllTypeArrDataToDefault = ([colors]: Array<Float32Array>, count, [defaultColor]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setColor(index, defaultColor, colors)
    })

    return [colors]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<Float32Array>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (basicMaterialComponentCount: number): state => {
    let defaultColor = [1.0, 1.0, 1.0]

    let [buffer, [colors]] = _initBufferData(basicMaterialComponentCount, [defaultColor])

    return {
        maxIndex: 0,
        buffer,
        colors,
        gameObjectMap: Map(),
        gameObjectBasicMaterialMap: Map(),
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
    let { gameObjectMap, gameObjectBasicMaterialMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectBasicMaterialMap: gameObjectBasicMaterialMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectBasicMaterialMap } = state

    return gameObjectBasicMaterialMap.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectBasicMaterialMap } = state

    return gameObjectBasicMaterialMap.toArray().map(([key, value]) => value)
}

export let getColor = (state: state, component: component) => {
    return OperateTypeArrayUtils.getColor(component, state.colors)
}

export let setColor = (state: state, component: component, color) => {
    OperateTypeArrayUtils.setColor(component, color, state.colors)

    return state
}