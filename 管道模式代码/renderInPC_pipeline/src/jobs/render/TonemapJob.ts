import { state as renderState } from "render/src/RenderStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { getState } from "../Utils"
import { states } from "renderInPC_pipeline_state_type/src/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<renderState> = (renderState, { getStatesFunc }) => {
    let states = getStatesFunc<renderState, states>(renderState)
    let { gl } = getState(states)

    return mostService.callFunc(() => {
        gl = getExnFromStrictNull(gl)

        console.log("tonemap for WebGL2")

        return renderState
    })
}