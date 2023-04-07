import { state as worldState } from "../world/WorldStateType";
import * as GameObjectManager from "../manager/gameObject/Manager"
import * as DataOrientedComponent1Manager from "../manager/dataOriented_component1/Manager"
import * as OtherComponent1Manager from "../manager/other_component1/Manager"

export let createState = ({ dataOrientedComponent1Count }): worldState => {
    return {
        gameObjectManagerState: GameObjectManager.createState(),
        dataOrientedComponent1ManagerState: DataOrientedComponent1Manager.createState(dataOrientedComponent1Count),
        otherComponent1ManagerState: OtherComponent1Manager.createState(),

        更多的DataOrientedManagerState和OtherComponentManagerState...
    }
}