import { getMaxVelocity } from "../manager/fly_component/Manager";
import { getPosition, setPosition } from "../manager/position_component/Manager";
import { getVelocity } from "../manager/velocity_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let fly = (worldState: worldState, positionComponent, velocityComponent, flyComponent): worldState => {
    let [x, y, z] = getPosition(worldState.positionComponentManagerState, positionComponent)

    let velocity = getVelocity(worldState.velocityComponentManagerState, velocityComponent)

    let maxVelocity = getMaxVelocity(worldState.flyComponentManagerState, flyComponent)

    velocity = velocity < maxVelocity ? (velocity * 2.0) : maxVelocity

    let positionComponentManagerState = setPosition(worldState.positionComponentManagerState, positionComponent, [x + velocity, y + velocity, z + velocity])

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}