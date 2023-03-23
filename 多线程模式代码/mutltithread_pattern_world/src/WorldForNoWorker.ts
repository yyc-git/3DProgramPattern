import { registerPipeline } from "pipeline_manager"
import { getPipeline as getNoWorkerPipeline } from "noWorker_pipeline/src/Main"
import { state } from "./WorldStateType"
import * as World from "./World"

export let createState = World.createState

export let unsafeGetPipeManagerState = World.unsafeGetPipeManagerState

export let setPipeManagerState = World.setPipeManagerState

export let init = World.init

export let update = World.update

export let render = World.render

export let registerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipeManagerState(state),
        getNoWorkerPipeline(),
        []
    )

    state = setPipeManagerState(state, pipelineManagerState)

    return state
}