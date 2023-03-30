import { state as worldState } from "../world/WorldStateType";
import * as GameObjectManager from "../manager/gameObject/Manager"
import * as PositionComponentManager from "../manager/position_component/Manager"
import * as VelocityComponentManager from "../manager/velocity_component/Manager"
import * as FlyComponentManager from "../manager/fly_component/Manager"
import * as InstanceComponentManager from "../manager/instance_component/Manager"

export let createState = ({ positionComponentCount, velocityComponentCount, flyComponentCount }): worldState => {
    return {
        gameObjectManagerState: GameObjectManager.createState(),
        positionComponentManagerState: PositionComponentManager.createState(positionComponentCount),
        velocityComponentManagerState: VelocityComponentManager.createState(velocityComponentCount),
        flyComponentManagerState: FlyComponentManager.createState(flyComponentCount),
        instanceComponentManagerState: InstanceComponentManager.createState()
    }
}