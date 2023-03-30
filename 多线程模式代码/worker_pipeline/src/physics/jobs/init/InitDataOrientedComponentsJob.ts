import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/physics/StateType"
import { createDataOrientedComponentStates } from "../../../../../mutltithread_pattern_world/src/WorldForPhysicsWorker"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let { transformComponentCount, transformComponentBuffer } = getState(states)

    return mostService.callFunc(() => {
        console.log("init data oriented components job exec on physics worker");

        return createDataOrientedComponentStates(worldState, transformComponentCount, transformComponentBuffer)
    })
}