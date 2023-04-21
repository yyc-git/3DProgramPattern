import { state as engineState } from "engine/src/EngineStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getGL } from "../Utils"
import { states } from "yi_engineInMobile_pipeline_state_type/src/StateType"

export let exec: execType<engineState> = (engineState, { getStatesFunc }) => {
    let states = getStatesFunc<engineState, states>(engineState)

    return mostService.callFunc(() => {
        let gl = getGL(states)

        console.log("tonemap for WebGL1")

        return engineState
    })
}