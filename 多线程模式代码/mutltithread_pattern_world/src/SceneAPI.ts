import { state as worldState } from "./WorldStateType"
import * as GameObjectManager from "multithread_pattern_ecs/src/manager/gameObject/Manager"
import * as TransformComponentManager from "multithread_pattern_ecs/src/manager/transform_component/Manager"
import * as BasicMaterialComponentManager from "multithread_pattern_ecs/src/manager/basicMaterial_component/Manager"
import { gameObject } from "multithread_pattern_ecs/src/gameObject/GameObjectType"
import { component } from "multithread_pattern_ecs/src/component/ComponentType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let createGameObject = (worldState: worldState): [worldState, gameObject] => {
    let [gameObjectManagerState, gameObject] = GameObjectManager.createGameObject(getExnFromStrictNull(worldState.ecsData.gameObjectManagerState))

    return [
        {
            ...worldState,
            ecsData: {
                ...worldState.ecsData,
                gameObjectManagerState
            }
        },
        gameObject
    ]
}

export let createTransformComponent = (worldState: worldState): [worldState, component] => {
    let [transformComponentManagerState, component] = TransformComponentManager.createComponent(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

    return [
        {
            ...worldState,
            ecsData: {
                ...worldState.ecsData,
                transformComponentManagerState
            }
        },
        component
    ]
}

export let createBasicMaterialComponent = (worldState: worldState): [worldState, component] => {
    let [basicMaterialComponentManagerState, component] = BasicMaterialComponentManager.createComponent(getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState))

    return [
        {
            ...worldState,
            ecsData: {
                ...worldState.ecsData,
                basicMaterialComponentManagerState
            }
        },
        component
    ]
}

export let setTransformComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            transformComponentManagerState: TransformComponentManager.setComponent(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState), gameObject, component)
        }
    }
}

export let setBasicMaterialComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            basicMaterialComponentManagerState: BasicMaterialComponentManager.setComponent(getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState), gameObject, component)
        }
    }
}

export let setColor = (worldState: worldState, component: component, color: Array<number>): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            basicMaterialComponentManagerState: BasicMaterialComponentManager.setColor(getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState), component, color)
        }
    }
}

export let setPosition = (worldState: worldState, component: component, position: Array<number>): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            transformComponentManagerState: TransformComponentManager.setPosition(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState), component, position)
        }
    }
}