import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/render/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let state = getState(states)

    return mostService.callFunc(() => {
        console.log("create render data buffer type array job exec on render worker");

        let renderDataBufferTypeArray = new Uint32Array(getExnFromStrictNull(state.renderDataBuffer))

        return setStatesFunc<worldState, states>(
            worldState,
            setState(states, {
                ...state,
                typeArray: renderDataBufferTypeArray
            })
        )
    })
}