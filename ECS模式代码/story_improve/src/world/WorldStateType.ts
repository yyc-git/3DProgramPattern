import { state as gameObjectManagerState } from "../manager/gameObject/ManagerStateType"
import { state as positionComponentManagerState } from "../manager/position_component/ManagerStateType"
import { state as velocityComponentManagerState } from "../manager/velocity_component/ManagerStateType"
import { state as flyComponentManagerState } from "../manager/fly_component/ManagerStateType"
import { state as instanceComponentManagerState } from "../manager/instance_component/ManagerStateType"

export type state = {
    gameObjectManagerState: gameObjectManagerState,
    positionComponentManagerState: positionComponentManagerState,
    velocityComponentManagerState: velocityComponentManagerState,
    flyComponentManagerState: flyComponentManagerState,
    instanceComponentManagerState: instanceComponentManagerState,
}