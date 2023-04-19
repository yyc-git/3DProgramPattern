import { registerPipeline } from "pipeline_manager"
import { getPipeline as getNoWorkerPipeline } from "noWorker_pipeline/src/Main"
import { getPipeline as getMainWorkerPipeline } from "worker_pipeline/src/main/Main"
import { state } from "./WorldStateType"
import * as World from "./World"

export let createState = World.createState

export let unsafeGetPipelineManagerState = World.unsafeGetPipelineManagerState

export let setPipelineManagerState = World.setPipelineManagerState

export let init = World.init

export let update = World.update

export let render = World.render

export let sync = (state: state): Promise<state> => {
    return World.runPipeline(state, "sync")
}

export let registerNoWorkerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipelineManagerState(state),
        getNoWorkerPipeline(),
        []
    )

    state = setPipelineManagerState(state, pipelineManagerState)

    return state
}

export let registerWorkerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipelineManagerState(state),
        getMainWorkerPipeline(),
        []
    )

    state = setPipelineManagerState(state, pipelineManagerState)

    return state
}