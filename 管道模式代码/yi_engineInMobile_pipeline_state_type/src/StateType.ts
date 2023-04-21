import { pipelineName as jiaEngineInMobilePipelineName, state as jiaEngineInMobilePipelineState } from "jia_engineInMobile_pipeline_state_type/src/StateType"

export const pipelineName = "YiEngineInMobile"

export type state = {
}

export type states = {
    [pipelineName]: state,
    [jiaEngineInMobilePipelineName]: jiaEngineInMobilePipelineState,
}
