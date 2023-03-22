import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/main/StateType"
import { createGetOtherWorkerDataStream } from "../../../CreateWorkerDataStreamUtils"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { renderWorker } = getState(states)

	renderWorker = getExnFromStrictNull(renderWorker)

	return createGetOtherWorkerDataStream(mostService, "FINISH_SEND_RENDER_DATA", renderWorker).map(() => {
		console.log("get finish render data job exec on main worker")

		return worldState
	})
}
