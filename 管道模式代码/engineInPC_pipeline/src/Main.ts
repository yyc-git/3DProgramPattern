import { state as engineState } from "engine/src/EngineStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "engineInPC_pipeline_state_type/src/StateType"
import * as InitWebGL2Job from "./jobs/init/InitWebGL2Job"
import * as DeferRenderJob from "./jobs/render/DeferRenderJob"
import * as TonemapJob from "./jobs/render/TonemapJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl2_engineInPC":
			return InitWebGL2Job.exec
		case "defer_render_engineInPC":
			return DeferRenderJob.exec
		case "tonemap_engineInPC":
			return TonemapJob.exec
		default:
			return null
	}
}

export let getPipeline = (): pipeline<engineState, state> => {
	return {
		pipelineName: pipelineName,
		createState: engineState => {
			return {
				gl: null
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "init",
				groups: [
					{
						name: "first_engineInPC",
						link: "concat",
						elements: [
							{
								"name": "init_webgl2_engineInPC",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_engineInPC"
			},
			{
				name: "render",
				groups: [
					{
						name: "first_engineInPC",
						link: "concat",
						elements: [
							{
								"name": "defer_render_engineInPC",
								"type_": "job"
							},
							//这里为了演示的目的，使用类型为group的element
							//也可以直接为类型为job的element(tonemap_engineInPC)
							{
								"name": "second_engineInPC",
								"type_": "group"
							},
						]
					},
					{
						name: "second_engineInPC",
						link: "concat",
						elements: [
							{
								"name": "tonemap_engineInPC",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_engineInPC"
			}
		],
	}
}
