import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { xWorkerWorker } = getState(states)

	return mostService.callFunc(() => {
		xWorkerWorker = getExnFromStrictNull(xWorkerWorker)

		xWorkerWorker.postMessage({
			command: "SEND_BEGIN_LOOP"
		})

		return worldState
	})
}