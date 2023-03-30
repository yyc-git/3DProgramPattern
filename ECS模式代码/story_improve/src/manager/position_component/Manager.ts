import { createBuffer } from "./BufferUtils"
import { createTypeArrays } from "./CreateTypeArrayUtils"
import { range } from "commonlib-ts/src/ArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/PositionComponentType"
import * as OperateTypeArrayUtils from "./OperateTypeArrayUtils"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _setAllTypeArrDataToDefault = ([positions]: Array<Float32Array>, count, [defaultPosition]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setPosition(index, defaultPosition, positions)
    })

    return [positions]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<Float32Array>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (positionComponentCount: number): state => {
    let defaultPosition = [0, 0, 0]

    let [buffer, [positions]] = _initBufferData(positionComponentCount, [defaultPosition])

    return {
        maxIndex: 0,
        buffer,
        positions,
        gameObjectMap: Map(),
        gameObjectPositionMap: Map(),
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
    let { gameObjectMap, gameObjectPositionMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectPositionMap: gameObjectPositionMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectPositionMap } = state

    return gameObjectPositionMap.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectPositionMap } = state

    return gameObjectPositionMap.toArray().map(([key, value]) => value)
}

export let getPosition = (state: state, component: component) => {
    return OperateTypeArrayUtils.getPosition(component, state.positions)
}

export let setPosition = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setPosition(component, position, state.positions)

    return state
}

export let batchUpdate = (state: state) => {
    return getAllComponents(state).reduce((state, component) => {
        console.log("更新PositionComponent: " + String(component))

        let [x, y, z] = getPosition(state, component)

        //更新position（如更新世界坐标系中的position）...
        let newPosition: [number, number, number] = [x * 2.0, y * 2.0, z * 2.0]

        return setPosition(state, component, newPosition)
    }, state)
}