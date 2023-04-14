import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"

export let exec: execType<worldState> = (worldState, _) => {
	return mostService.callFunc(() => {
		console.log("send finish physics data job exec on physics worker")

		postMessage({
			command: "FINISH_SEND_PHYSICS_DATA"
		})

		return worldState
	})
}