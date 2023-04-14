import { state as worldState } from "mutltithread_pattern_world_abstract/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type_abstract/src/x_worker/StateType"
import { exec as execGetInitXWorkerData } from "./jobs/init/GetInitXWorkerDataJob"
import { exec as execInitDataOrientedComponents } from "./jobs/init/InitDataOrientedComponentsJob"
import { exec as execDoSomethingWhenInit } from "./jobs/init/DoSomethingJob"
import { exec as execCreateXWorkerDataBufferTypeArray } from "./jobs/init/CreateXWorkerDataBufferTypeArrayJob"
import { exec as execSendFinishInitXWorkerData } from "./jobs/init/SendFinishInitXWorkerDataJob"
import { exec as execGetXWorkerData } from "./jobs/pipelineWhenLoop/GetXWorkerDataJob"
import { exec as execDoSomethingWhenLoop } from "./jobs/pipelineWhenLoop/DoSomethingJob"
import { exec as execSendFinishXWorkerData } from "./jobs/pipelineWhenLoop/SendFinishXWorkerDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
    switch (jobName) {
        case "get_init_xWorker_data_xWorker_worker":
            return execGetInitXWorkerData
        case "init_data_oriented_components_xWorker_worker":
            return execInitDataOrientedComponents
        case "create_xWorker_data_buffer_typeArray_xWorker_worker":
            return execCreateXWorkerDataBufferTypeArray
        case "dosomething_when_init_xWorker_worker":
            return execDoSomethingWhenInit
        case "send_finish_init_xWorker_data_xWorker_worker":
            return execSendFinishInitXWorkerData
        case "get_xWorker_data_xWorker_worker":
            return execGetXWorkerData
        case "dosomething_when_loop_xWorker_worker":
            return execDoSomethingWhenLoop
        case "send_finish_xWorker_data_xWorker_worker":
            return execSendFinishXWorkerData
        default:
            return null
    }
}

export let getPipeline = (): pipeline<worldState, state> => {
    return {
        pipelineName: pipelineName,
        createState: worldState => {
            return {
                xWorkerDataBuffer: null,
                typeArray: null,
                allDataOrientedComponent1Indices: null,
                dataOrientedComponent1Count: null,
                dataOrientedComponent1Buffer: null,
                otherData: null
            }
        },
        getExec: _getExec,
        allPipelineData: [{
            name: "init",
            groups: [
                {
                    name: "first_xWorker_worker",
                    link: "concat",
                    elements: [
                        {
                            "name": "get_init_xWorker_data_xWorker_worker",
                            "type_": "job"
                        },
                        {
                            "name": "init_data_oriented_components_xWorker_worker",
                            "type_": "job"
                        },
                        {
                            "name": "create_xWorker_data_buffer_typeArray_xWorker_worker",
                            "type_": "job"
                        },
                        {
                            "name": "dosomething_when_init_xWorker_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_finish_init_xWorker_data_xWorker_worker",
                            "type_": "job"
                        },
                    ]
                }
            ],
            first_group: "first_xWorker_worker"
        },
        {
            name: "pipelineWhenLoop",
            groups: [
                {
                    name: "first_xWorker_worker",
                    link: "concat",
                    elements: [
                        {
                            "name": "get_xWorker_data_xWorker_worker",
                            "type_": "job"
                        },
                        {
                            "name": "dosomething_when_loop_xWorker_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_finish_xWorker_data_xWorker_worker",
                            "type_": "job"
                        },
                    ]
                }
            ],
            first_group: "first_xWorker_worker"
        }
        ],
    }
}
