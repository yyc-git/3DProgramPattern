import * as PositionComponentManager from "../manager/position_component/Manager";
import * as VelocityComponentManager from "../manager/velocity_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let move = (worldState: worldState, positionComponent, velocityComponent): worldState => {
    let [x, y, z] = PositionComponentManager.getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = VelocityComponentManager.getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let positionComponentManagerState = PositionComponentManager.setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}