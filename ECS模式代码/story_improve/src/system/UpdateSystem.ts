import * as PositionComponentManager from "../manager/position_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let update = (worldState: worldState): worldState => {
    let positionComponentManagerState = PositionComponentManager.batchUpdate(worldState.positionComponentManagerState)

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}