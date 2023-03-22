import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { renderWorker, physicsWorker } = getState(states)

	return mostService.callFunc(() => {
		console.log("send begin loop data job exec on main worker")

		renderWorker = getExnFromStrictNull(renderWorker)
		physicsWorker = getExnFromStrictNull(physicsWorker)

		renderWorker.postMessage({
			operateType: "SEND_BEGIN_LOOP"
		})
		physicsWorker.postMessage({
			operateType: "SEND_BEGIN_LOOP"
		})

		return worldState
	})
}