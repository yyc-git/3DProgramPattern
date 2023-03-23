import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type_abstract/src/main/StateType"
import { exec as execCreateWorkerInstance } from "./jobs/init/CreateWorkerInstanceJob"
import { exec as execCreateWorkerXDataBuffer } from "./jobs/init/CreateWorkerXDataBufferJob"
import { exec as execSendInitWorkerXData } from "./jobs/init/SendInitWorkerXDataJob"
import { exec as execGetFinishSendInitWorkerXData } from "./jobs/init/GetFinishSendInitWorkerXDataJob"
import { exec as execDoSomething } from "./jobs/update/DoSomethingJob"
import { exec as execUpdateWorkerXDataBuffer } from "./jobs/update/UpdateWorkerXDataBufferJob"
import { exec as execSendWorkerXData } from "./jobs/update/SendWorkerXDataJob"
import { exec as execSendBeginLoopData } from "./jobs/update/SendBeginLoopDataJob"
import { exec as execGetFinishWorkerXData } from "./jobs/sync/GetFinishWorkerXDataJob"
import { exec as execUpdateSharedData } from "./jobs/sync/UpdateSharedDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
	switch (jobName) {
		case "create_worker_instance_main_worker":
			return execCreateWorkerInstance
		case "create_workerX_data_buffer_main_worker":
			return execCreateWorkerXDataBuffer
		case "send_init_workerX_data_main_worker":
			return execSendInitWorkerXData
		case "get_finish_send_init_workerX_data_main_worker":
			return execGetFinishSendInitWorkerXData
		case "dosomething_main_worker":
			return execDoSomething
		case "update_workerX_data_buffer_main_worker":
			return execUpdateWorkerXDataBuffer
		case "send_workerX_data_main_worker":
			return execSendWorkerXData
		case "send_begin_loop_data_main_worker":
			return execSendBeginLoopData
		case "get_finish_workerX_data_main_worker":
			return execGetFinishWorkerXData
		case "update_shared_data_main_worker":
			return execUpdateSharedData
		default:
			return null

	}
}

export let getPipeline = (): pipeline<worldState, state> => {
	return {
		pipelineName: pipelineName,
		createState: worldState => {
			return {
				workerXWorker: null,
				workerXDataBuffer: null,
				workerXDataBufferTypeArray: null,
				workerXOtherData: null
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
							"name": "create_workerX_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_init_workerX_data_main_worker",
							"type_": "job"
						}
					]
				},
				{
					name: "wait",
					link: "merge",
					elements: [
						{
							"name": "get_finish_send_init_workerX_data_main_worker",
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
							"name": "update_workerX_data_buffer_main_worker",
							"type_": "job"
						},
						{
							"name": "send_begin_loop_data_main_worker",
							"type_": "job"
						},
						{
							"name": "send_workerX_data_main_worker",
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
							"name": "dosomething_main_worker",
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
							"name": "update_shared_data_main_worker",
							"type_": "job"
						}
					]
				},
				{
					name: "wait",
					link: "merge",
					elements: [
						{
							"name": "get_finish_workerX_data_main_worker",
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
