import { state as renderState } from "render/src/RenderStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "renderInPC_pipeline_state_type/src/StateType"
import * as InitWebGL2Job from "./jobs/render/InitWebGL2Job"
import * as DeferRenderJob from "./jobs/render/DeferRenderJob"
import * as TonemapJob from "./jobs/render/TonemapJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl2_renderInPC":
			return InitWebGL2Job.exec
		case "defer_render_renderInPC":
			return DeferRenderJob.exec
		case "tonemap_renderInPC":
			return TonemapJob.exec
		default:
			return null
	}
}

export let getPipeline = (): pipeline<renderState, state> => {
	return {
		pipelineName: pipelineName,
		createState: renderState => {
			return {
				gl: null
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "render",
				groups: [
					{
						name: "first_renderInPC",
						link: "concat",
						elements: [
							{
								"name": "init_webgl2_renderInPC",
								"type_": "job"
							},
							{
								"name": "second_renderInPC",
								"type_": "group"
							},
						]
					},
					{
						name: "second_renderInPC",
						link: "concat",
						elements: [
							{
								"name": "defer_render_renderInPC",
								"type_": "job"
							},
							{
								"name": "tonemap_renderInPC",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_renderInPC"
			}
		],
	}
}
