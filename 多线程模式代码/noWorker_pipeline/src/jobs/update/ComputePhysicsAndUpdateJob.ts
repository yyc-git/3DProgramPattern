import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getAllComponents as getAllTransformComponents, setPosition } from "../../../../multithread_pattern_ecs/src/manager/transform_component/Manager"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { computeAveragePositions } from "multithread_pattern_webgl_pipeline_utils/src/utils/PhysicsUtils"

let _updateAllTransformPositions = (worldState: worldState, newPositions): worldState => {
    let transformComponentManagerState = getExnFromStrictNull(worldState.ecsData.transformComponentManagerState)

    transformComponentManagerState = getAllTransformComponents(transformComponentManagerState).reduce((transformComponentManagerState, transform) => {
        let [_, newPosition] = newPositions[transform]

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

export let exec: execType<worldState> = (worldState, _) => {
    return mostService.callFunc(() => {
        console.log("compute physics job")

        worldState = _updateAllTransformPositions(worldState, computeAveragePositions(worldState, getAllTransformComponents(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))))

        return worldState
    })
}