import { state as worldState } from "./WorldStateType"
import * as GameObjectManager from "../manager/gameObject/Manager"
import * as DataOrientedComponent1Manager from "../manager/dataOriented_component1/Manager"
import * as OtherComponent1Manager from "../manager/other_component1/Manager"
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

export let createDataOrientedComponent1 = (worldState: worldState): [worldState, component] => {
    let [dataOrientedComponent1ManagerState, component] = DataOrientedComponent1Manager.createComponent(worldState.dataOrientedComponent1ManagerState)

    return [
        {
            ...worldState,
            dataOrientedComponent1ManagerState
        },
        component
    ]
}

export let createOtherComponent1 = (worldState: worldState): [worldState, component] => {
    let [otherComponent1ManagerState, component] = OtherComponent1Manager.createComponent(worldState.otherComponent1ManagerState)

    return [
        {
            ...worldState,
            otherComponent1ManagerState
        },
        component
    ]
}

export let setDataOrientedComponent1 = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        dataOrientedComponent1ManagerState: DataOrientedComponent1Manager.setComponent(worldState.dataOrientedComponent1ManagerState, gameObject, component)
    }
}

export let setOtherComponent1 = (worldState: worldState, gameObject: gameObject, component: component): worldState => {
    return {
        ...worldState,
        otherComponent1ManagerState: OtherComponent1Manager.setComponent(worldState.otherComponent1ManagerState, gameObject, component)
    }
}