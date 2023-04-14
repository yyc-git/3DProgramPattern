import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"

export let exec: execType<worldState> = (worldState, _) => {
    return mostService.callFunc(() => {
        postMessage({
            command: "FINISH_SEND_INIT_XWORKER_DATA"
        })

        return worldState
    })
}