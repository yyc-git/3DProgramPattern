import { pipelineName as jiaRenderInMobilePipelineName, state as jiaRenderInMobilePipelineState } from "jia_renderInMobile_pipeline_state_type/src/StateType"

export const pipelineName = "YiRenderInMobile"

export type state = {
}

export type states = {
    [pipelineName]: state,
    [jiaRenderInMobilePipelineName]: jiaRenderInMobilePipelineState,
}
