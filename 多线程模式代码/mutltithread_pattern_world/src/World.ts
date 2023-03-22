import { state } from "./WorldStateType"
import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import { createState as createPipelineManagerState, runPipeline as runPipelineManager, init as initPipelineManager } from "pipeline_manager"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { unsafeGetState, setState } from "./WorldStateContainer"
import { createState as createGameObjectManagerState } from "multithread_pattern_ecs/src/manager/gameObject/Manager"
import { createState as createTransformManagerState } from "multithread_pattern_ecs/src/manager/transform_component/Manager"
import { createState as createNoLightMateiralManagerState } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/Manager"

export let createState = ({ transformComponentCount, noLightMaterialComponentCount }): state => {
    return {
        ecsData:
        {
            gameObjectManagerState: createGameObjectManagerState(),
            transformComponentManagerState: createTransformManagerState(transformComponentCount),
            noLightMaterialComponentManagerState: createNoLightMateiralManagerState(noLightMaterialComponentCount)
        },
        pipelineState: createPipelineManagerState(),
    }
}

export let unsafeGetPipeManagerState = (state: state) => {
    return state.pipelineState
}

export let setPipeManagerState = (state: state, pipelineState: pipelineState) => {
    return {
        ...state,
        pipelineState: pipelineState
    }
}

export let runPipeline = (
    renderState: state,
    pipelineName: string
): Promise<state> => {
    let tempWorldState: state | null = null

    return mostService.map(
        (renderState: state) => {
            tempWorldState = renderState

            return renderState
        },
        runPipelineManager<state>(renderState, [
            unsafeGetState,
            setState,
            unsafeGetPipeManagerState,
            setPipeManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempWorldState)
    })
}

export let init = (state: state, canvas): Promise<state> => {
    state = initPipelineManager(state, [
        unsafeGetPipeManagerState, setPipeManagerState
    ])

    globalThis.canvas = canvas

    return runPipeline(state, "init")
}

export let render = (state: state): Promise<state> => {
    return runPipeline(state, "render")
}