import { state as worldState } from "render/src/RenderStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "renderInPC_pipeline_state_type/src/StateType"
import { exec as execInitWebGL2 } from "./jobs/render/InitWebGL2Job"
import { exec as execDeferRender } from "./jobs/render/DeferRenderJob"
import { exec as execTonemap } from "./jobs/render/TonemapJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_webgl2_renderInPC":
			return execInitWebGL2
		case "defer_render_renderInPC":
			return execDeferRender
		case "tonemap_renderInPC":
			return execTonemap
		default:
			return null
	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: managerState => {
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
