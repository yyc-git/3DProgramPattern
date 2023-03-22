import { registerPipeline } from "pipeline_manager"
import { getPipeline as getRootPipeline } from "multithread_pattern_root_pipeline/src/Main"
import { getPipeline as getNoWorkerPipeline } from "noWorker_pipeline/src/Main"
import { getPipeline as getMainWorkerPipeline } from "worker_pipeline/src/main/Main"
import { state } from "./WorldStateType"
import * as World from "./World"

export let createState = World.createState

export let unsafeGetPipeManagerState = World.unsafeGetPipeManagerState

export let setPipeManagerState = World.setPipeManagerState

export let init = World.init

export let update = World.update

export let render = World.render

export let sync = (state: state): Promise<state> => {
    return World.runPipeline(state, "sync")
}

export let registerNoWorkerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipeManagerState(state),
        getRootPipeline(),
        []
    )
    pipelineManagerState = registerPipeline(
        pipelineManagerState,
        getNoWorkerPipeline(),
        [
            {
                pipelineName: "init",
                insertElementName: "init_root",
                insertAction: "after"
            },
            {
                pipelineName: "update",
                insertElementName: "update_root",
                insertAction: "after"
            },
            {
                pipelineName: "render",
                insertElementName: "render_root",
                insertAction: "after"
            }
        ]
    )

    state = setPipeManagerState(state, pipelineManagerState)

    return state
}

export let registerWorkerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipeManagerState(state),
        getRootPipeline(),
        []
    )
    pipelineManagerState = registerPipeline(
        pipelineManagerState,
        getMainWorkerPipeline(),
        [
            {
                pipelineName: "init",
                insertElementName: "init_root",
                insertAction: "after"
            },
            {
                pipelineName: "update",
                insertElementName: "update_root",
                insertAction: "after"
            },
            {
                pipelineName: "sync",
                insertElementName: "sync_root",
                insertAction: "after"
            }
        ]
    )

    state = setPipeManagerState(state, pipelineManagerState)

    return state
}