import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import { state as gameObjectManagerState } from "multithread_pattern_ecs/src/manager/gameObject/ManagerStateType"
import { state as transformComponentManagerState } from "multithread_pattern_ecs/src/manager/transform_component/ManagerStateType"
import { state as noLightMaterialComponentManagerState } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/ManagerStateType"

type ecsData = {
    gameObjectManagerState: gameObjectManagerState,
    transformComponentManagerState: transformComponentManagerState,
    noLightMaterialComponentManagerState: noLightMaterialComponentManagerState,
}

export type state = {
    ecsData: ecsData,
    noWorkerPipelineState: pipelineState
}