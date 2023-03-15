// import { service as mostService } from "meta3d-bs-most-protocol/src/service/ServiceType"
// import { service as webgl1Service } from "meta3d-webgl1-protocol/src/service/ServiceType"
// import { pipelineName as dataPipelineName, state as dataState } from "meta3d-pipeline-webgl1-data-protocol/src/StateType"

export const pipelineName = "RenderInPC"

export type state = {
    // mostService: mostService,
    // webgl1Service: webgl1Service,
    // canvas: HTMLCanvasElement
    gl: WebGL2RenderingContext | null
}

export type states = {
    // [dataPipelineName]: dataState,
    [pipelineName]: state,
}
