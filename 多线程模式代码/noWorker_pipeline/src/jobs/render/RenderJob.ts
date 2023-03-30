import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "noWorker_pipeline_state_type/src/StateType"
import { getAllGameObjects } from "multithread_pattern_ecs/src/manager/gameObject/Manager"
import { getComponentExn as getMaterialExn } from "multithread_pattern_ecs/src/manager/noLightMaterial_component/Manager"
import { getComponentExn as getTransformExn } from "multithread_pattern_ecs/src/manager/transform_component/Manager"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { clear, getRenderData, render } from "multithread_pattern_webgl_pipeline_utils/src/utils/RenderUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("render job")

        let gl = getExnFromStrictNull(state.gl)

        clear(gl)

        getAllGameObjects(getExnFromStrictNull(worldState.ecsData.gameObjectManagerState)).forEach(gameObject => {
            let material = getMaterialExn(getExnFromStrictNull(worldState.ecsData.noLightMaterialComponentManagerState), gameObject)
            let transform = getTransformExn(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState), gameObject)

            let [count, program, color, modelMatrix] = getRenderData(material, transform, getExnFromStrictNull(state.program), getExnFromStrictNull(worldState.ecsData.noLightMaterialComponentManagerState), getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

            render(gl, getExnFromStrictNull(state.vbo.verticesVBO), getExnFromStrictNull(state.vbo.indicesVBO), program, modelMatrix, color, count)
        })

        return worldState
    })
}