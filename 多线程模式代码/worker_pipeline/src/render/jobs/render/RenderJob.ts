import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/render/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { clear, getRenderData, render } from "multithread_pattern_webgl_pipeline_utils/src/utils/RenderUtils"
import { range } from "commonlib-ts/src/ArrayUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("render job exec on render worker")

        let gl = getExnFromStrictNull(state.gl)

        let renderDataBufferTypeArray = getExnFromStrictNull(state.typeArray);
        let renderGameObjectCount = getExnFromStrictNull(state.renderGameObjectsCount)

        //清空画布
        clear(gl)

        //渲染所有的gameObject
        range(0, renderGameObjectCount - 1).forEach(renderGameObjectIndex => {
            let transform = renderDataBufferTypeArray[renderGameObjectIndex * 2];
            let material = renderDataBufferTypeArray[renderGameObjectIndex * 2 + 1];

            let [count, program, color, modelMatrix] = getRenderData(material, transform, getExnFromStrictNull(state.program), getExnFromStrictNull(worldState.ecsData.basicMaterialComponentManagerState), getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

            render(gl, getExnFromStrictNull(state.vbo.verticesVBO), getExnFromStrictNull(state.vbo.indicesVBO), program, modelMatrix, color, count)
        })

        return worldState
    })
}