import { state as worldState } from "render/src/RenderStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState } from "../Utils"
import { states } from "renderInPC_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)
    let { gl } = getState(states)

    return mostService.callFunc(() => {
        gl = getExnFromStrictNull(gl)

        console.log("延迟渲染")

        return worldState
    })
}