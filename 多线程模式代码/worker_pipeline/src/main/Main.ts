import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type/src/main/StateType"
import { exec as execCreateWorkerInstance } from "./jobs/init/CreateWorkerInstanceJob";
import { exec as execCreateRenderDataBuffer } from "./jobs/init/CreateRenderDataBufferJob";
import { exec as execSendInitRenderData } from "./jobs/init/SendInitRenderDataJob";
import { exec as execGetFinishSendInitRenderData } from "./jobs/init/GetFinishSendInitRenderDataJob";
import { exec as execUpdateRenderDataBuffer } from "./jobs/update/UpdateRenderDataBufferJob";
import { exec as execSendRenderData } from "./jobs/update/SendRenderDataJob";
import { exec as execSendBeginLoopData } from "./jobs/update/SendBeginLoopDataJob";
import { exec as execGeiFinishRenderData } from "./jobs/render/GetFinishRenderDataJob";

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "create_main_worker_instance_main_worker":
			return execCreateWorkerInstance
		case "create_render_data_buffer_main_worker":
			return execCreateRenderDataBuffer;
		case "send_init_render_data_main_worker":
			return execSendInitRenderData;
		case "get_finish_send_init_render_data_main_worker":
			return execGetFinishSendInitRenderData;
		case "update_render_data_buffer_main_worker":
			return execUpdateRenderDataBuffer;
		case "send_render_data_main_worker":
			return execSendRenderData;
		case "send_begin_loop_data_main_worker":
			return execSendBeginLoopData;
		case "get_finish_render_data_main_worker":
			return execGeiFinishRenderData;
		default:
			return null

	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
			return {
				worker: null,
				typeArray: null ,
				renderGameObjectsCount: null
			}
		},
		getExec: _getExec,
		allPipelineData: [{
			name: "init",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "create_main_worker_instance_main_worker",
							"type_": "job"
						},
						{
							"name": "begin_init",
							"type_": "group"
						}
					]
				},
				{
					name: "begin_init",
					link: "merge",
					elements: [
						{
							"name": "init",
							"type_": "group"
						},
						{
							"name": "get_finish_send_init_render_data_main_worker",
							"type_": "job",
							"is_set_state": false
						}
					]
				},
				{
					name: "init",
					link: "concat",
					elements: [
						{
							"name": "create_render_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_init_render_data_main_worker",
							"type_": "job"
						}
					]
				}
			],
			first_group: "first_main_worker"
		},
		{
			name: "update",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "begin_update",
							"type_": "group"
						}
					]
				},
				{
					name: "begin_update",
					link: "concat",
					elements: [
						{
							"name": "update_render_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_begin_loop_data_main_worker",
							"type_": "job"
						},
						{
							"name": "send_render_data_main_worker",
							"type_": "job"
						},
					]
				},
			],
			first_group: "first_main_worker"
		},
		{
			name: "render",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "get_finish_render_data_main_worker",
							"type_": "job"
						}
					]
				}
			],
			first_group: "first_main_worker"
		}
		],
	}
}
