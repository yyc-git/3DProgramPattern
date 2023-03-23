import { service as mostService } from "most/src/MostService"
import { createStateForWorker, init, update } from "mutltithread_pattern_world/src/WorldForPhysicsWorker"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { registerPipeline } from "pipeline_manager"
import { getPipeline as getPhysicsWorkerPipeline } from "./Main"
import { setPipeManagerState, unsafeGetPipeManagerState } from "mutltithread_pattern_world/src/World"

let _frame = (worldState: worldState) => {
	return update(worldState)
}

let _registerAllPipelines = (worldState: worldState): worldState => {
	let pipelineManagerState = registerPipeline(
		unsafeGetPipeManagerState(worldState),
		getPhysicsWorkerPipeline(),
		[]
	)

	return setPipeManagerState(worldState, pipelineManagerState)
}

let worldState = createStateForWorker()

worldState = _registerAllPipelines(worldState)


let tempWorldState: worldState | null = null

init(worldState).then(worldState => {
	console.log("finish init on physics worker");

	tempWorldState = worldState
})

mostService.drain(
	mostService.tap(
		(_) => {
			_frame(getExnFromStrictNull(tempWorldState)).then((worldState) => {
				tempWorldState = worldState
			})
		},
		mostService.filter(
			(event) => {
				console.log(event);
				return event.data.operateType === "SEND_BEGIN_LOOP";
			},
			mostService.fromEvent<MessageEvent, Window & typeof globalThis>("message", self, false)
		)
	)
)