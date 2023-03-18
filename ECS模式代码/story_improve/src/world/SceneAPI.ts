import { state as worldState } from "./WorldStateType"
import * as GameObjectManager from "../manager/gameObject/Manager"
import * as PositionComponentManager from "../manager/position_component/Manager"
import * as VelocityComponentManager from "../manager/velocity_component/Manager"
import * as FlyComponentManager from "../manager/fly_component/Manager"
import * as InstanceComponentManager from "../manager/instance_component/Manager"
import { gameObject } from "../gameObject/GameObjectType"
import { component } from "../component/ComponentType"

export let createGameObject = (worldState: worldState): [worldState, gameObject] => {
    let [gameObjectManagerState, gameObject] = GameObjectManager.createGameObject(worldState.gameObjectManagerState)

    return [
        {
            ...worldState,
            gameObjectManagerState
        },
        gameObject
    ]
}

export let createPositionComponent = (worldState: worldState): [worldState, component] => {
    let [positionComponentManagerState, component] = PositionComponentManager.createComponent(worldState.positionComponentManagerState)

    return [
        {
            ...worldState,
            positionComponentManagerState
        },
        component
    ]
}

export let createVelocityComponent = (worldState: worldState): [worldState, component] => {
    let [velocityComponentManagerState, component] = VelocityComponentManager.createComponent(worldState.velocityComponentManagerState)

    return [
        {
            ...worldState,
            velocityComponentManagerState
        },
        component
    ]
}

export let createFlyComponent = (worldState: worldState): [worldState, component] => {
    let [flyComponentManagerState, component] = FlyComponentManager.createComponent(worldState.flyComponentManagerState)

    return [
        {
            ...worldState,
            flyComponentManagerState
        },
        component
    ]
}

export let createInstanceComponent = (worldState: worldState): [worldState, component] => {
    let [instanceComponentManagerState, component] = InstanceComponentManager.createComponent(worldState.instanceComponentManagerState)

    return [
        {
            ...worldState,
            instanceComponentManagerState
        },
        component
    ]
}

export let setPositionComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        positionComponentManagerState: PositionComponentManager.setComponent(worldState.positionComponentManagerState, gameObject, component)
    }
}

export let setVelocityComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        velocityComponentManagerState: VelocityComponentManager.setComponent(worldState.velocityComponentManagerState, gameObject, component)
    }
}

export let setFlyComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        flyComponentManagerState: FlyComponentManager.setComponent(worldState.flyComponentManagerState, gameObject, component)
    }
}

export let setInstanceComponent = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        instanceComponentManagerState: InstanceComponentManager.setComponent(worldState.instanceComponentManagerState, gameObject, component)
    }
}