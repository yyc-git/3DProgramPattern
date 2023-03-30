import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/physics/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { computeAveragePositions } from "multithread_pattern_webgl_pipeline_utils/src/utils/PhysicsUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("compute physics job exec on physics worker")

        let positions = getExnFromStrictNull(state.positions)

        computeAveragePositions(worldState, getExnFromStrictNull(state.allTransformIndices)).forEach(([transform, newPosition]) => {
            positions[transform * 3] = newPosition[0]
            positions[transform * 3 + 1] = newPosition[1]
            positions[transform * 3 + 2] = newPosition[2]
        })

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...state,
                positions
            })
        )
    })
}