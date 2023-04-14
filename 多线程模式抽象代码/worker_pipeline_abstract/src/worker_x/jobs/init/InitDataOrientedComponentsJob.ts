import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/x_worker/StateType"
import { createDataOrientedComponentStates } from "../../../../../mutltithread_pattern_world_abstract/src/WorldForXWorker"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let { dataOrientedComponent1Count, dataOrientedComponent1Buffer } = getState(states)

    return mostService.callFunc(() => {
        return createDataOrientedComponentStates(worldState, dataOrientedComponent1Count, dataOrientedComponent1Buffer)
    })
}