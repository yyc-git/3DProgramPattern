import { state } from "./WorldStateType"
import { createState as createPipelineManagerState, init as initPipelineManager } from "pipeline_manager"
import { runPipeline, setPipelineManagerState, unsafeGetPipelineManagerState } from "./World"
import { createState as createDataOrientedComponent1ManagerState } from "multithread_pattern_ecs_abstract/src/dataOriented_component1/Manager"

export let createStateForWorker = (): state => {
    return {
        ecsData:
        {
            gameObjectManagerState: null,
            dataOrientedComponent1ManagerState: null
        },
        pipelineState: createPipelineManagerState(),
    }
}

export let createDataOrientedComponentStates = (
    state: state,
    dataOrientedComponent1Count, dataOrientedComponent1Buffer
): state => {
    return {
        ...state,
        ecsData:
        {
            ...state.ecsData,
            dataOrientedComponent1ManagerState: createDataOrientedComponent1ManagerState(dataOrientedComponent1Count, dataOrientedComponent1Buffer),
        }
    }
}

export let init = (state: state): Promise<state> => {
    state = initPipelineManager(state, [
        unsafeGetPipelineManagerState, setPipelineManagerState
    ])

    return runPipeline(state, "init")
}

export let pipelineWhenLoop = (state: state): Promise<state> => {
    return runPipeline(state, "pipelineWhenLoop")
}