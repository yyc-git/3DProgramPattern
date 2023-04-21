import { state, states, pipelineName } from "jia_engineInMobile_pipeline_state_type/src/StateType"

export function getState(states: states): state {
    //pipelineName来自JiaEngineInMobilePipelineStateType
    return states[pipelineName]
}

export function setState(states: states, state: state): states {
    return Object.assign({}, states, {
        //pipelineName来自JiaEngineInMobilePipelineStateType
        [pipelineName]: state
    })
}