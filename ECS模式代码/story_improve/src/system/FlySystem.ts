import * as FlyComponentManager from "../manager/fly_component/Manager";
import * as PositionComponentManager from "../manager/position_component/Manager";
import * as VelocityComponentManager from "../manager/velocity_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let fly = (worldState: worldState, positionComponent, velocityComponent, flyComponent): worldState => {
    let [x, y, z] = PositionComponentManager.getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = VelocityComponentManager.getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let maxVelocity = FlyComponentManager.getMaxVelocity(worldState.flyComponentManagerState, flyComponent)

    //根据maxVelociy、velocity，更新positionComponent的position
    velocity = velocity < maxVelocity ? (velocity * 2.0) : maxVelocity
    let positionComponentManagerState = PositionComponentManager.setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}