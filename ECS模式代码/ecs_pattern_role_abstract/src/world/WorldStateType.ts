import { state as gameObjectManagerState } from "../manager/gameObject/ManagerStateType"
import { state as dataOrientedComponent1ManagerState } from "../manager/dataoriented_component1/ManagerStateType"
import { state as otherComponent1ManagerState } from "../manager/other_component1/ManagerStateType"

export type state = {
    gameObjectManagerState: gameObjectManagerState,
    dataOrientedComponent1ManagerState: dataOrientedComponent1ManagerState,
    otherComponent1ManagerState: otherComponent1ManagerState,
}