import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type/src/Main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getAllComponents as getAllTransforms } from "multithread_pattern_ecs/src/manager/transform_component/Manager"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { physicsWorker } = getState(states)

	return mostService.callFunc(() => {
		console.log("send render data job exec on main worker")

		physicsWorker = getExnFromStrictNull(physicsWorker)

		let allTransformIndices = getAllTransforms(getExnFromStrictNull(worldState.ecsData.transformComponentManagerState))

		physicsWorker.postMessage({
			command: "SEND_PHYSICS_DATA",
			allTransformIndices: allTransformIndices,
		})

		return worldState
	})
}