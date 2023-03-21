import { state } from "./WorldStateType"
import { state as noWorkerPipelineState } from "pipeline_manager/src/type/StateType"
import { createState as createPipelineManagerState, registerPipeline, runPipeline, init as initPipelineManager } from "pipeline_manager"
import { getPipeline as getRootPipeline } from "multithread_pattern_root_pipeline/src/Main"
import { getPipeline as getNoWorkerPipeline } from "noWorker_pipeline/src/Main"
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
        noWorkerPipelineState: createPipelineManagerState(),
    }
}

export let registerAllPipelines = (state: state) => {
    let noWorkerPipelineState = registerPipeline(
        state.noWorkerPipelineState,
        getRootPipeline(),
        []
    )
    noWorkerPipelineState = registerPipeline(
        noWorkerPipelineState,
        getNoWorkerPipeline(),
        [
            {
                pipelineName: "init",
                insertElementName: "init_root",
                insertAction: "after"
            },
            {
                pipelineName: "render",
                insertElementName: "render_root",
                insertAction: "after"
            }
        ]
    )

    state = {
        ...state,
        noWorkerPipelineState: noWorkerPipelineState
    }

    return state
}

let _unsafeGetPipeManagerState = (state: state) => {
    return state.noWorkerPipelineState
}

let _setPipeManagerState = (state: state, noWorkerPipelineState: noWorkerPipelineState) => {
    return {
        ...state,
        noWorkerPipelineState: noWorkerPipelineState
    }
}

let _runPipeline = (
    renderState: state,
    pipelineName: string
): Promise<state> => {
    let tempWorldState: state | null = null

    return mostService.map(
        (renderState: state) => {
            tempWorldState = renderState

            return renderState
        },
        runPipeline<state>(renderState, [
            unsafeGetState,
            setState,
            _unsafeGetPipeManagerState,
            _setPipeManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempWorldState)
    })
}

export let init = (state: state, canvas): Promise<state> => {
    state = initPipelineManager(state, [
        _unsafeGetPipeManagerState, _setPipeManagerState
    ])

    globalThis.canvas = canvas

    return _runPipeline(state, "init")
}

export let render = (state: state): Promise<state> => {
    return _runPipeline(state, "render")
}