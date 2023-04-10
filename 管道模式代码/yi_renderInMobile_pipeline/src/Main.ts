import { state as renderState } from "render/src/RenderStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "yi_renderInMobile_pipeline_state_type/src/StateType"
import { exec as execForwardRender } from "./jobs/render/ForwardRenderJob"
import { exec as execTonemap } from "./jobs/render/TonemapJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "forward_render_yi_renderInMobile":
			return execForwardRender
		case "tonemap_yi_renderInMobile":
			return execTonemap
		default:
			return null
	}
}

export let getPipeline = (): pipeline<renderState, state> => {
	return {
		pipelineName: pipelineName,
		createState: renderState => {
			return {
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "render",
				groups: [
					{
						name: "first_yi_renderInMobile",
						link: "concat",
						elements: [
							{
								"name": "forward_render_yi_renderInMobile",
								"type_": "job"
							},
							{
								"name": "tonemap_yi_renderInMobile",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_yi_renderInMobile"
			}
		],
	}
}
