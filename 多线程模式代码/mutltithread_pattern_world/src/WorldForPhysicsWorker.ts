import { state } from "./WorldStateType"
import { createState as createPipelineManagerState, init as initPipelineManager } from "pipeline_manager"
import { runPipeline, setPipeManagerState, unsafeGetPipeManagerState } from "./World"
import { createState as createTransformManagerState } from "multithread_pattern_ecs/src/manager/transform_component/ManagetForWorker"

export let createStateForWorker = (): state => {
    return {
        ecsData:
        {
            gameObjectManagerState: null,
            transformComponentManagerState: null,
            basicMaterialComponentManagerState: null
        },
        pipelineState: createPipelineManagerState(),
    }
}

export let createDataOrientedComponentStates = (
    state: state,
    transformComponentCount, transformComponentBuffer
): state => {
    return {
        ...state,
        ecsData:
        {
            ...state.ecsData,
            transformComponentManagerState: createTransformManagerState(transformComponentCount, transformComponentBuffer),
        }
    }
}

export let init = (state: state): Promise<state> => {
    state = initPipelineManager(state, [
        unsafeGetPipeManagerState, setPipeManagerState
    ])

    return runPipeline(state, "init")
}

export let update = (state: state): Promise<state> => {
    return runPipeline(state, "update")
}