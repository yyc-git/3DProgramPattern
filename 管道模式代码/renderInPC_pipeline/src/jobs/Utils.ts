import { state, states, pipelineName } from "renderInPC_pipeline_state_type/src/StateType"

export function getState(states: states): state {
    //pipelineName来自RenderInPCPipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自RenderInPCPipelineStateType
        [pipelineName]: state
    })
}