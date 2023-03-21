import { state as worldState } from "./WorldStateType"
import * as GameObjectManager from "multithread_pattern_ecs/src/manager/gameObject/Manager"
import * as TransformComponentManager from "multithread_pattern_ecs/src/manager/transform_component/Manager"
import * as NoLightMaterialComponentManager from "multithread_pattern_ecs/src/manager/noLightMaterial_component/Manager"
import { gameObject } from "multithread_pattern_ecs/src/gameObject/GameObjectType"
import { component } from "multithread_pattern_ecs/src/component/ComponentType"

export let createGameObject = (worldState: worldState): [worldState, gameObject] => {
    let [gameObjectManagerState, gameObject] = GameObjectManager.createGameObject(worldState.ecsData.gameObjectManagerState)

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
    let [transformComponentManagerState, component] = TransformComponentManager.createComponent(worldState.ecsData.transformComponentManagerState)

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

export let createNoLightMaterialComponent = (worldState: worldState): [worldState, component] => {
    let [noLightMaterialComponentManagerState, component] = NoLightMaterialComponentManager.createComponent(worldState.ecsData.noLightMaterialComponentManagerState)

    return [
        {
            ...worldState,
            ecsData: {
                ...worldState.ecsData,
                noLightMaterialComponentManagerState
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
            transformComponentManagerState: TransformComponentManager.setComponent(worldState.ecsData.transformComponentManagerState, gameObject, component)
        }
    }
}

export let setNoLightMaterialComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            noLightMaterialComponentManagerState: NoLightMaterialComponentManager.setComponent(worldState.ecsData.noLightMaterialComponentManagerState, gameObject, component)
        }
    }
}

export let setColor = (worldState: worldState, component: component, color: Array<number>): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            noLightMaterialComponentManagerState: NoLightMaterialComponentManager.setColor(worldState.ecsData.noLightMaterialComponentManagerState, component, color)
        }
    }
}

export let setPosition = (worldState: worldState, component: component, position: Array<number>): worldState => {
    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            transformComponentManagerState: TransformComponentManager.setPosition(worldState.ecsData.transformComponentManagerState, component, position)
        }
    }
}