import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"

export let exec: execType<worldState> = (worldState, _) => {
    return mostService.callFunc(() => {
        console.log("render root job")

        return worldState
    })
}