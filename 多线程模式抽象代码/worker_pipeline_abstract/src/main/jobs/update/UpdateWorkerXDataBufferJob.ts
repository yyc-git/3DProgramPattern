import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState, setState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/main/StateType"

export let exec: execType<worldState> = (worldState, { getStatesFunc, setStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let state = getState(states)

	return mostService.callFunc(() => {
		console.log("update workerXDataBufferTypeArray")

		return setStatesFunc<worldState, states>(
			worldState,
			setState(states, {
				...state,
				workerXDataBufferTypeArray
			})
		)
	})
}