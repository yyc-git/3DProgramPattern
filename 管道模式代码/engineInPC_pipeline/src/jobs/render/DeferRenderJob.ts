import { state as engineState } from "engine/src/EngineStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState } from "../Utils"
import { states } from "engineInPC_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<engineState> = (engineState, { getStatesFunc }) => {
    let states = getStatesFunc<engineState, states>(engineState)
    let { gl } = getState(states)

    return mostService.callFunc(() => {
        gl = getExnFromStrictNull(gl)

        console.log("延迟渲染")

        return engineState
    })
}