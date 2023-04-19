import { service as mostService } from "most/src/MostService"
import { createStateForWorker, init, pipelineWhenLoop } from "mutltithread_pattern_world_abstract/src/WorldForXWorker"
import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { registerPipeline } from "pipeline_manager"
import { getPipeline as getXWorkerPipeline } from "./Main"
import { setPipelineManagerState, unsafeGetPipelineManagerState } from "mutltithread_pattern_world_abstract/src/World"

let _frame = (worldState: worldState) => {
	return pipelineWhenLoop(worldState)
}

let _registerAllPipelines = (worldState: worldState): worldState => {
	let pipelineManagerState = registerPipeline(
		unsafeGetPipelineManagerState(worldState),
		getXWorkerPipeline(),
		[]
	)

	return setPipelineManagerState(worldState, pipelineManagerState)
}

let worldState = createStateForWorker()

worldState = _registerAllPipelines(worldState)


let tempWorldState: worldState | null = null

init(worldState).then(worldState => {
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
				return event.data.command === "SEND_BEGIN_LOOP";
			},
			mostService.fromEvent<MessageEvent, Window & typeof globalThis>("message", self, false)
		)
	)
)