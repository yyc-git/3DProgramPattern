import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/Main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { xWorker } = getState(states)

	return mostService.callFunc(() => {
		xWorker = getExnFromStrictNull(xWorker)

		xWorker.postMessage({
			command: "SEND_XWORKER_DATA",
			someData:xxx
		})

		return worldState
	})
}