import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/render/StateType"
import { createDataOrientedComponentStates } from "../../../../../mutltithread_pattern_world/src/WorldForRenderWorker"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
    let states = getStatesFunc<worldState, states>(worldState)

    let { transformComponentCount, noLightMaterialComponentCount, transformComponentBuffer, noLightMaterialComponentBuffer } = getState(states)

    return mostService.callFunc(() => {
        console.log("init data oriented components job exec on render worker");

        return createDataOrientedComponentStates(worldState, transformComponentCount, noLightMaterialComponentCount, transformComponentBuffer, noLightMaterialComponentBuffer)
    })
}