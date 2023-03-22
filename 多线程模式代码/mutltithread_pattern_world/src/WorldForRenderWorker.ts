import { state } from "./WorldStateType"
import { createState as createPipelineManagerState, init as initPipelineManager } from "pipeline_manager"
import { runPipeline, setPipeManagerState, unsafeGetPipeManagerState } from "./World"
import { createState as createTransformManagerState } from "multithread_pattern_ecs/src/manager/transform_component/ManagetForWorker"
import { createState as createNoLightMateiralManagerState } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/ManagerForWorker"

export let createStateForWorker = (): state => {
    return {
        ecsData:
        {
            gameObjectManagerState: null,
            transformComponentManagerState: null,
            noLightMaterialComponentManagerState: null
        },
        pipelineState: createPipelineManagerState(),
    }
}

export let createDataOrientedComponentStates = (
    state: state,
    transformComponentCount, noLightMaterialComponentCount, transformComponentBuffer, noLightMaterialComponentBuffer
): state => {
    return {
        ...state,
        ecsData:
        {
            ...state.ecsData,
            transformComponentManagerState: createTransformManagerState(transformComponentCount, transformComponentBuffer),
            noLightMaterialComponentManagerState: createNoLightMateiralManagerState(noLightMaterialComponentCount, noLightMaterialComponentBuffer)
        }
    }
}

export let init = (state: state): Promise<state> => {
    state = initPipelineManager(state, [
        unsafeGetPipeManagerState, setPipeManagerState
    ])

    return runPipeline(state, "init")
}

export let render = (state: state): Promise<state> => {
    return runPipeline(state, "render")
}