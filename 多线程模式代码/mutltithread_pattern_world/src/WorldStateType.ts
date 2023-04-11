import { state as pipelineState } from "pipeline_manager/src/type/StateType"
import { state as gameObjectManagerState } from "multithread_pattern_ecs/src/manager/gameObject/ManagerStateType"
import { state as transformComponentManagerState } from "multithread_pattern_ecs/src/manager/transform_component/ManagerStateType"
import { state as basicMaterialComponentManagerState } from "multithread_pattern_ecs/src/manager/basicMaterial_component/ManagerStateType"

type ecsData = {
    gameObjectManagerState: gameObjectManagerState | null,
    transformComponentManagerState: transformComponentManagerState | null,
    basicMaterialComponentManagerState: basicMaterialComponentManagerState | null,
}

export type state = {
    ecsData: ecsData,
    pipelineState: pipelineState
}