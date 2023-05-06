import { state } from "./WorldStateType"
import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import * as PipelineManager from "pipeline_manager"
import { service as mostService } from "most/src/MostService"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { unsafeGetState, setState } from "./WorldStateContainer"
import * as GameObjectManager from "multithread_pattern_ecs/src/manager/gameObject/Manager"
import * as TransformComponentManager from "multithread_pattern_ecs/src/manager/transform_component/Manager"
import * as BasicMaterialComponentManager from "multithread_pattern_ecs/src/manager/basicMaterial_component/Manager"

export let createState = ({ transformComponentCount, basicMaterialComponentCount }): state => {
    return {
        ecsData:
        {
            gameObjectManagerState: GameObjectManager.createState(),
            transformComponentManagerState: TransformComponentManager.createState(transformComponentCount),
            basicMaterialComponentManagerState: BasicMaterialComponentManager.createState(basicMaterialComponentCount)
        },
        pipelineState: PipelineManager.createState(),
    }
}

export let unsafeGetPipelineManagerState = (state: state) => {
    return state.pipelineState
}

export let setPipelineManagerState = (state: state, pipelineState: pipelineState) => {
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
        PipelineManager.runPipeline<state>(renderState, [
            unsafeGetState,
            setState,
            unsafeGetPipelineManagerState,
            setPipelineManagerState
        ], pipelineName)
    ).drain().then((_) => {
        return getExnFromStrictNull(tempWorldState)
    })
}

export let init = (state: state, canvas): Promise<state> => {
    state = PipelineManager.init(state, [
        unsafeGetPipelineManagerState, setPipelineManagerState
    ])

    globalThis.canvas = canvas

    return runPipeline(state, "init")
}

export let update = (state: state): Promise<state> => {
    return runPipeline(state, "update")
}

export let render = (state: state): Promise<state> => {
    return runPipeline(state, "render")
}