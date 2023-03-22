import { Map } from "immutable"
import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "noWorker_pipeline_state_type/src/StateType"
import { exec as execCreateGL } from "./jobs/init/CreateGLJob"
import { exec as execInitMaterial } from "./jobs/init/InitMaterialJob"
import { exec as execInitVBO } from "./jobs/init/InitVBOJob"
import { exec as execRender } from "./jobs/render/RenderJob"
import { exec as execSendUniformShaderData } from "./jobs/render/SendUniformShaderDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "create_gl_noWorker":
			return execCreateGL
		case "init_material_noWorker":
			return execInitMaterial
		case "init_vbo_noWorker":
			return execInitVBO
		case "send_uniform_shader_data_noWorker":
			return execSendUniformShaderData
		case "render_noWorker":
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
				gl: null,
				program: null,
				vbo: {
					verticesVBO: null,
					indicesVBO: null
				}
			}
		},
		getExec: _getExec,
		allPipelineData: [
			{
				name: "init",
				groups: [
					{
						name: "first_noWorker",
						link: "concat",
						elements: [
							{
								"name": "create_gl_noWorker",
								"type_": "job"
							},
							{
								"name": "init_vbo_noWorker",
								"type_": "job"
							},
							{
								"name": "init_material_noWorker",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_noWorker"
			},
			{
				name: "render",
				groups: [
					{
						name: "first_noWorker",
						link: "concat",
						elements: [
							{
								"name": "send_uniform_shader_data_noWorker",
								"type_": "job"
							},
							{
								"name": "render_noWorker",
								"type_": "job"
							},
						]
					}
				],
				first_group: "first_noWorker"
			}
		],
	}
}
