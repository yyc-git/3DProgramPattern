import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { getAllComponents as getAllTransformComponents, setPosition } from "../../../../../multithread_pattern_ecs/src/manager/transform_component/Manager"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _updateAllTransformPositions = (worldState: worldState, newPositions: Float32Array): worldState => {
    let transformComponentManagerState = getExnFromStrictNull(worldState.ecsData.transformComponentManagerState)

    transformComponentManagerState = getAllTransformComponents(transformComponentManagerState).reduce((transformComponentManagerState, transform) => {
        let newPosition = [
            newPositions[transform * 3],
            newPositions[transform * 3 + 1],
            newPositions[transform * 3 + 2]
        ]

        return setPosition(transformComponentManagerState, transform, newPosition)
    }, transformComponentManagerState)

    return {
        ...worldState,
        ecsData: {
            ...worldState.ecsData,
            transformComponentManagerState
        }
    }
}

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("update all transform positions job exec on main worker")

        worldState = _updateAllTransformPositions(worldState, getExnFromStrictNull(state.physicsDataBufferTypeArray))

        return worldState
    })
}