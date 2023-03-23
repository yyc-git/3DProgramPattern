import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type/src/main/StateType"
import { exec as execCreateWorkerInstance } from "./jobs/init/CreateWorkerInstanceJob"
import { exec as execCreateRenderDataBuffer } from "./jobs/init/CreateRenderDataBufferJob"
import { exec as execCreatePhysicsDataBuffer } from "./jobs/init/CreatePhysicsDataBufferJob"
import { exec as execSendInitRenderData } from "./jobs/init/SendInitRenderDataJob"
import { exec as execSendInitPhysicsData } from "./jobs/init/SendInitPhysicsDataJob"
import { exec as execGetFinishSendInitRenderData } from "./jobs/init/GetFinishSendInitRenderDataJob"
import { exec as execGetFinishSendInitPhysicsData } from "./jobs/init/GetFinishSendInitPhysicsDataJob"
import { exec as execUpdateTransform } from "./jobs/update/UpdateTransformJob"
import { exec as execUpdateRenderDataBuffer } from "./jobs/update/UpdateRenderDataBufferJob"
import { exec as execSendRenderData } from "./jobs/update/SendRenderDataJob"
import { exec as execSendBeginLoopData } from "./jobs/update/SendBeginLoopDataJob"
import { exec as execGetFinishRenderData } from "./jobs/sync/GetFinishRenderDataJob"
import { exec as execGetFinishPhysicsData } from "./jobs/sync/GetFinishPhysicsDataJob"
import { exec as execUpdateAllTransformPositions } from "./jobs/sync/UpdateAllTransformPositionsJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "create_worker_instance_main_worker":
			return execCreateWorkerInstance
		case "create_render_data_buffer_main_worker":
			return execCreateRenderDataBuffer
		case "create_physics_data_buffer_main_worker":
			return execCreatePhysicsDataBuffer
		case "send_init_render_data_main_worker":
			return execSendInitRenderData
		case "send_init_physics_data_main_worker":
			return execSendInitPhysicsData
		case "get_finish_send_init_render_data_main_worker":
			return execGetFinishSendInitRenderData
		case "get_finish_send_init_physics_data_main_worker":
			return execGetFinishSendInitPhysicsData
		case "update_transform_main_worker":
			return execUpdateTransform
		case "update_render_data_buffer_main_worker":
			return execUpdateRenderDataBuffer
		case "send_render_data_main_worker":
			return execSendRenderData
		case "send_begin_loop_data_main_worker":
			return execSendBeginLoopData
		case "get_finish_render_data_main_worker":
			return execGetFinishRenderData
		case "get_finish_physics_data_main_worker":
			return execGetFinishPhysicsData
		case "update_all_transform_positions_main_worker":
			return execUpdateAllTransformPositions
		default:
			return null

	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
			return {
				renderWorker: null,
				physicsWorker: null,
				renderDataBuffer: null,
				renderDataBufferTypeArray: null,
				renderGameObjectsCount: null,
				physicsDataBuffer: null,
				physicsDataBufferTypeArray: null
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
							"name": "create_worker_instance_main_worker",
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
							"name": "wait",
							"type_": "group"
						},
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
							"name": "create_physics_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_init_render_data_main_worker",
							"type_": "job"
						},
						{
							"name": "send_init_physics_data_main_worker",
							"type_": "job"
						}
					]
				},
				{
					name: "wait",
					link: "merge",
					elements: [
						{
							"name": "get_finish_send_init_render_data_main_worker",
							"type_": "job",
							is_set_state: false
						},
						{
							"name": "get_finish_send_init_physics_data_main_worker",
							"type_": "job",
							is_set_state: false
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
						{
							"name": "update",
							"type_": "group"
						}
					]
				},
				{
					name: "update",
					link: "concat",
					elements: [
						{
							"name": "update_transform_main_worker",
							"type_": "job"
						},
					]
				}
			],
			first_group: "first_main_worker"
		},
		{
			name: "sync",
			groups: [
				{
					name: "first_main_worker",
					link: "concat",
					elements: [
						{
							"name": "wait",
							"type_": "group",
						},
						{
							"name": "update_all_transform_positions_main_worker",
							"type_": "job"
						}
					]
				},
				{
					name: "wait",
					link: "merge",
					elements: [
						{
							"name": "get_finish_render_data_main_worker",
							"type_": "job",
							is_set_state: false
						},
						{
							"name": "get_finish_physics_data_main_worker",
							"type_": "job",
							is_set_state: false
						}
					]
				},
			],
			first_group: "first_main_worker"
		}
		],
	}
}
