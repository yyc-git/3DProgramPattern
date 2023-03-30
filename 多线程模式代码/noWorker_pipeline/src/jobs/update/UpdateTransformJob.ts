import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { batchUpdate } from "../../../../multithread_pattern_ecs/src/manager/transform_component/Manager"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, _) => {
    return mostService.callFunc(() => {
        console.log("update transform job")

        let transformComponentManagerState = batchUpdate(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

        return {
            ...worldState,
            ecsData: {
                ...worldState.ecsData,
                transformComponentManagerState
            }
        }
    })
}