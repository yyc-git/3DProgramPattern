import { registerPipeline } from "pipeline_manager"
import { getPipeline as getMainWorkerPipeline } from "worker_pipeline_abstract/src/main/Main"
import { state } from "./WorldStateType"
import { createState as createGameObjectManagerState } from "multithread_pattern_ecs_abstract/src/manager/gameObject/Manager"
import { createState as createDataOrientedComponent1ManagerState } from "multithread_pattern_ecs_abstract/src/dataOriented_component1/Manager"
import * as World from "./World"

export let createState = ({ dataOrientedComponent1Count }): worldState => {
    return {
        gameObjectManagerState: createGameObjectManagerState(),
        dataOrientedComponent1ManagerState: createDataOrientedComponent1ManagerState(dataOrientedComponent1Count),
    }
}

export let unsafeGetPipeManagerState = World.unsafeGetPipeManagerState

export let setPipeManagerState = World.setPipeManagerState

export let init = World.init

export let update = World.update

export let render = World.render

export let sync = (state: state): Promise<state> => {
    return World.runPipeline(state, "sync")
}

export let registerWorkerAllPipelines = (state: state) => {
    let pipelineManagerState = registerPipeline(
        unsafeGetPipeManagerState(state),
        getMainWorkerPipeline(),
        []
    )

    state = setPipeManagerState(state, pipelineManagerState)

    return state
}