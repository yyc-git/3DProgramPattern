import { state as worldState } from "mutltithread_pattern_world/src/WorldStateType"
import { pipeline } from "pipeline_manager/src/type/PipelineType"
import { pipelineName, state } from "worker_pipeline_state_type/src/render/StateType"
import { exec as execGetInitRenderData } from "./jobs/init/GetInitRenderDataJob"
import { exec as execCreateGL } from "./jobs/init/CreateGLJob"
import { exec as execInitVBO } from "./jobs/init/InitVBOJob"
import { exec as execInitMaterial } from "./jobs/init/InitMaterialJob"
import { exec as execInitDataOrientedComponents } from "./jobs/init/InitDataOrientedComponentsJob"
import { exec as execCreateRenderDataBufferTypeArray } from "./jobs/init/CreateRenderDataBufferTypeArrayJob"
import { exec as execSendFinishInitRenderData } from "./jobs/init/SendFinishInitRenderDataJob"
import { exec as execGetRenderData } from "./jobs/render/GetRenderDataJob"
import { exec as execSendUniformShaderData } from "./jobs/render/SendUniformShaderDataJob"
import { exec as execRender } from "./jobs/render/RenderJob"
import { exec as execSendFinishRenderData } from "./jobs/render/SendFinishRenderDataJob"

let _getExec = (_pipelineName: string, jobName: string) => {
    switch (jobName) {
        case "get_init_render_data_render_worker":
            return execGetInitRenderData
        case "init_data_oriented_components_render_worker":
            return execInitDataOrientedComponents
        case "create_render_data_buffer_typeArray_render_worker":
            return execCreateRenderDataBufferTypeArray
        case "init_vbo_render_worker":
            return execInitVBO
        case "create_gl_render_worker":
            return execCreateGL
        case "init_material_render_worker":
            return execInitMaterial
        case "send_finish_init_render_data_render_worker":
            return execSendFinishInitRenderData
        case "get_render_data_render_worker":
            return execGetRenderData
        case "send_uniform_shader_data_render_worker":
            return execSendUniformShaderData
        case "render_render_worker":
            return execRender
        case "send_finish_render_data_render_worker":
            return execSendFinishRenderData
        default:
            return null
    }
}

export let getPipeline = (): pipeline<worldState, state> => {
    return {
        pipelineName: pipelineName,
        createState: worldState => {
            return {
                canvas: null,
                gl: null,
                vbo: {
                    verticesVBO: null,
                    indicesVBO: null
                },
                program: null,
                viewMatrix: null,
                pMatrix: null,
                renderDataBuffer: null,
                typeArray: null,
                renderGameObjectsCount: 0,
                transformComponentCount: null,
                basicMaterialComponentCount: null,
                transformComponentBuffer: null,
                basicMaterialComponentBuffer: null
            }
        },
        getExec: _getExec,
        allPipelineData: [{
            name: "init",
            groups: [
                {
                    name: "first_render_worker",
                    link: "concat",
                    elements: [
                        {
                            "name": "get_init_render_data_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "init_data_oriented_components_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "create_render_data_buffer_typeArray_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "create_gl_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "init_vbo_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "init_material_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_finish_init_render_data_render_worker",
                            "type_": "job"
                        },
                    ]
                }
            ],
            first_group: "first_render_worker"
        },
        {
            name: "render",
            groups: [
                {
                    name: "first_render_worker",
                    link: "concat",
                    elements: [
                        {
                            "name": "get_render_data_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_uniform_shader_data_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "render_render_worker",
                            "type_": "job"
                        },
                        {
                            "name": "send_finish_render_data_render_worker",
                            "type_": "job"
                        },
                    ]
                }
            ],
            first_group: "first_render_worker"
        }
        ],
    }
}
