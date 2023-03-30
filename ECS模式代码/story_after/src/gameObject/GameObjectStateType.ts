import { state as positionComponentState } from "../component/PositionComponentStateType"
import { state as velocityComponentState } from "../component/VelocityComponentStateType"
import { state as flyComponentState } from "../component/FlyComponentStateType"
import { state as instanceComponentState } from "../component/InstanceComponentStateType"

type id = number

export type gameObject = id

export type state = {
    positionComponent: positionComponentState | null,
    velocityComponent: velocityComponentState | null
    flyComponent: flyComponentState | null,
    instanceComponent: instanceComponentState | null
}