import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "noWorker_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { createProgram } from "multithread_pattern_webgl_pipeline_utils/src/utils/MaterialUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("init material job");

        let gl = getExnFromStrictNull(state.gl)

        let program = createProgram(gl)

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...state,
                program: program
            })
        )
    })
}