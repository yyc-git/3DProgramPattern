import * as BufferUtils from "./BufferUtils"
import * as CreateTypeArrayUtils from "./CreateTypeArrayUtils"
import { range } from "commonlib-ts/src/ArrayUtils"
import { state, TypeArrayType } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/DataOrientedComponent1Type"
import * as OperateTypeArrayUtils from "./OperateTypeArrayUtils"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _setAllTypeArrDataToDefault = ([value1s, value2s]: Array<Float32Array>, count, [defaultValue1, defaultValue2]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setValue1(index, defaultValue1, value1s)
        OperateTypeArrayUtils.setValue2(index, defaultValue2, value2s)
    })

    return [value1s, value2s]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<TypeArrayType>] => {
    let buffer = BufferUtils.createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(CreateTypeArrayUtils.createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (dataorientedComponentCount: number): state => {
    let defaultValue1 = default value1
    let defaultValue2 = default value2

    let [buffer, [value1s, value2s]] = _initBufferData(dataorientedComponentCount, [defaultValue1, defaultValue2])

    return {
        maxIndex: 0,
        buffer,
        value1s,
        value2s,
        gameObjectMap: Map(),
        gameObjectDataOrientedComponent1Map: Map(),
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
    let { gameObjectMap, gameObjectDataOrientedComponent1Map } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectDataOrientedComponent1Map: gameObjectDataOrientedComponent1Map.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectDataOrientedComponent1Map } = state

    return gameObjectDataOrientedComponent1Map.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectDataOrientedComponent1Map } = state

    return gameObjectDataOrientedComponent1Map.toArray().map(([key, value]) => value)
}

export let getValue1 = (state: state, component: component) => {
    return OperateTypeArrayUtils.getValue1(component, state.value1s)
}

export let setValue1 = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setValue1(component, position, state.value1s)

    return state
}

export let getValue2 = (state: state, component: component) => {
    return OperateTypeArrayUtils.getValue2(component, state.value2s)
}

export let setValue2 = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setValue2(component, position, state.value2s)

    return state
}

export let batchOperate = (state: state) => {
    let allComponents = getAllComponents(state)

    console.log("批量操作")

    return state
}