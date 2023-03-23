import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import { state as gameObjectManagerState } from "multithread_pattern_ecs_abstract/src/manager/gameObject/ManagerStateType"
import { state as dataOrientedComponent1ManagerState } from "multithread_pattern_ecs_abstract/src/manager/dataoriented_component1/ManagerStateType"

type ecsData = {
    gameObjectManagerState: gameObjectManagerState,
    dataOrientedComponent1ManagerState: dataOrientedComponent1ManagerState,
}

export type state = {
    ecsData: ecsData,
    pipelineState: pipelineState
}