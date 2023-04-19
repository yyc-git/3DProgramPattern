import { service as mostService } from "most/src/MostService"
import { createStateForWorker, init, render } from "mutltithread_pattern_world/src/WorldForRenderWorker"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { registerPipeline } from "pipeline_manager"
import { getPipeline as getRenderWorkerPipeline } from "./Main"
import { setPipelineManagerState, unsafeGetPipelineManagerState } from "mutltithread_pattern_world/src/World"

let _frame = (worldState: worldState) => {
	return render(worldState)
}

let _registerAllPipelines = (worldState: worldState): worldState => {
	let pipelineManagerState = registerPipeline(
		unsafeGetPipelineManagerState(worldState),
		getRenderWorkerPipeline(),
		[]
	)

	return setPipelineManagerState(worldState, pipelineManagerState)
}

let worldState = createStateForWorker()

worldState = _registerAllPipelines(worldState)


let tempWorldState: worldState | null = null

init(worldState).then(worldState => {
	console.log("finish init on render worker");

	tempWorldState = worldState
})

//主循环
//基于most.js库，使用FRP处理异步
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
				return event.data.command === "SEND_BEGIN_LOOP";
			},
			mostService.fromEvent<MessageEvent, Window & typeof globalThis>("message", self, false)
		)
	)
)