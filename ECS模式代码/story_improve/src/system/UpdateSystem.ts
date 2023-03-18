import { batchUpdate} from "../manager/position_component/Manager";
import { state as worldState } from "../world/WorldStateType";

export let update = (worldState: worldState): worldState => {
    let positionComponentManagerState = batchUpdate(worldState.positionComponentManagerState)

    return {
        ...worldState,
        positionComponentManagerState: positionComponentManagerState
    }
}