import { getPosition, setPosition } from "../manager/position_component/Manager";
import { getVelocity } from "../manager/velocity_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let move = (worldState: worldState, positionComponent, velocityComponent): worldState => {
    let [x, y, z] = getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let positionComponentManagerState = setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}