import { service as mostService } from "most/src/MostService"
import * as WorldForRenderWorker from "mutltithread_pattern_world/src/WorldForRenderWorker"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import * as PipelineManager from "pipeline_manager"
import { getPipeline as getRenderWorkerPipeline } from "./Main"
import { setPipelineManagerState, unsafeGetPipelineManagerState } from "mutltithread_pattern_world/src/World"

let _frame = (worldState: worldState) => {
	return WorldForRenderWorker.render(worldState)
}

let _registerAllPipelines = (worldState: worldState): worldState => {
	let pipelineManagerState = PipelineManager.registerPipeline(
		unsafeGetPipelineManagerState(worldState),
		getRenderWorkerPipeline(),
		[]
	)

	return setPipelineManagerState(worldState, pipelineManagerState)
}

let worldState = WorldForRenderWorker.createStateForWorker()

worldState = _registerAllPipelines(worldState)


let tempWorldState: worldState | null = null

WorldForRenderWorker.init(worldState).then(worldState => {
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