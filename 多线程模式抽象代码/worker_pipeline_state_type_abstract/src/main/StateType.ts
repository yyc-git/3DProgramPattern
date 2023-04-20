export const pipelineName = "Worker_Main"

export type state = {
    xWorker: Worker | null,
    xWorkerDataBuffer: SharedArrayBuffer | null,
    xWorkerDataBufferTypeArray: null | Uint32Array,
    xWorkerOtherData: any | null
}

export type states = {
    [pipelineName]: state,
}
