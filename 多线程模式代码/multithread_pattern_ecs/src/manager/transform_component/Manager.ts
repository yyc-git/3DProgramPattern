import { createBuffer } from "./BufferUtils"
import { createTypeArrays } from "./CreateTypeArrayUtils"
import { range } from "commonlib-ts/src/ArrayUtils"
import { state } from "./ManagerStateType"
import { Map } from "immutable"
import { component } from "../../component/TransformComponentType"
import * as OperateTypeArrayUtils from "./OperateTypeArrayUtils"
import { gameObject } from "../../gameObject/GameObjectType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _setAllTypeArrDataToDefault = ([modelMatrices, positions]: Array<Float32Array>, count, [defaultModelMatrix, defaultPosition]) => {
    range(0, count - 1).forEach(index => {
        OperateTypeArrayUtils.setModelMatrix(index, defaultModelMatrix, modelMatrices)
        OperateTypeArrayUtils.setPosition(index, defaultPosition, positions)
    })

    return [modelMatrices, positions]
}

let _initBufferData = (count, defaultDataTuple): [ArrayBuffer, Array<Float32Array>] => {
    let buffer = createBuffer(count)

    let typeArrData = _setAllTypeArrDataToDefault(createTypeArrays(buffer, count), count, defaultDataTuple)

    return [buffer, typeArrData]
}

export let createState = (transformComponentCount: number): state => {
    let defaultModelMatrix = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]
    let defaultPosition = [0, 0, 0]

    let [buffer, [modelMatrices, positions]] = _initBufferData(transformComponentCount, [defaultModelMatrix, defaultPosition])

    return {
        maxIndex: 0,
        buffer,
        modelMatrices,
        positions,
        gameObjectMap: Map(),
        gameObjectTransformMap: Map(),
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
    let { gameObjectMap, gameObjectTransformMap } = state

    return {
        ...state,
        gameObjectMap: gameObjectMap.set(component, gameObject),
        gameObjectTransformMap: gameObjectTransformMap.set(gameObject, component)
    }
}

export let hasComponent = (state: state, gameObject: gameObject): boolean => {
    let { gameObjectTransformMap } = state

    return gameObjectTransformMap.has(gameObject)
}

export let getAllComponents = (state: state): Array<component> => {
    let { gameObjectTransformMap } = state

    return gameObjectTransformMap.toArray().map(([key, value]) => value)
}

export let getModelMatrix = (state: state, component: component) => {
    return OperateTypeArrayUtils.getModelMatrixTypeArray(component, state.modelMatrices)
}

export let setModelMatrixByPosition = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setModelMatrixByPosition(component, position, state.modelMatrices)

    return state
}

export let getPosition = (state: state, component: component) => {
    return OperateTypeArrayUtils.getPosition(component, state.positions)
}

export let setPosition = (state: state, component: component, position) => {
    OperateTypeArrayUtils.setPosition(component, position, state.positions)

    return state
}

// let _fakeCompute = (position:Array<number>) => {
//     for(let )
// }

export let batchUpdate = (state: state) => {
    return getAllComponents(state).reduce((state, component) => {
        let position = getPosition(state, component)

        setModelMatrixByPosition(state, component, position)

        return state
    }, state)
}