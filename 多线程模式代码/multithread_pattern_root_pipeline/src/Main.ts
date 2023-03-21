import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "multithread_pattern_root_pipeline_state_type/src/StateType"
import { exec as execInit } from "./jobs/init/InitJob"
import { exec as execUpdate } from "./jobs/update/UpdateJob"
import { exec as execRender } from "./jobs/render/RenderJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "init_root":
			return execInit
		case "update_root":
			return execUpdate
		case "render_root":
			return execRender
		default:
			return null
	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
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
						name: "first_root",
						link: "concat",
						elements: [
							{
								"name": "init_root",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_root"
			},
			{
				name: "update",
				groups: [
					{
						name: "first_root",
						link: "concat",
						elements: [
							{
								"name": "update_root",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_root"
			},
			{
				name: "render",
				groups: [
					{
						name: "first_root",
						link: "concat",
						elements: [
							{
								"name": "render_root",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_root"
			}
		],
	}
}
