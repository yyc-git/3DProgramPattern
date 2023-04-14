import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { service as mostService } from "most/src/MostService"
import { getState } from "../Utils"
import { exec as execType } from "pipeline_manager/src/type/PipelineType"
import { states } from "worker_pipeline_state_type_abstract/src/main/StateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getAllComponents as getAllDataOrientedComponent1s } from "multithread_pattern_ecs_abstract/src/manager/dataoriented_component1/Manager"

export let exec: execType<worldState> = (worldState, { getStatesFunc }) => {
	let states = getStatesFunc<worldState, states>(worldState)

	let { xWorkerWorker, xWorkerDataBuffer } = getState(states)

	return mostService.callFunc(() => {
		xWorkerWorker = getExnFromStrictNull(xWorkerWorker)

		let dataOrientedComponent1Count = (globalThis as any).dataOrientedComponent1Count

		let allDataOrientedComponent1Indices = getAllDataOrientedComponent1s(getExnFromStrictNull(worldState.ecsData.dataOrientedComponent1ManagerState))

		xWorkerWorker.postMessage({
			command: "SEND_INIT_XWORKER_DATA",
			xWorkerDataBuffer: getExnFromStrictNull(xWorkerDataBuffer),
			allDataOrientedComponent1Indices: allDataOrientedComponent1Indices,
			dataOrientedComponent1Count,
			dataorientedComponent1Buffer: getExnFromStrictNull(worldState.ecsData.dataOrientedComponent1ManagerState).buffer,
			otherData: xxx
		})

		return worldState
	})
}