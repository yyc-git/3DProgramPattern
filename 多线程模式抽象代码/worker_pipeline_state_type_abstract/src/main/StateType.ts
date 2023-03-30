export const pipelineName = "Worker_Main"

export type state = {
    workerXWorker: Worker | null,
    workerXDataBuffer: SharedArrayBuffer | null,
    workerXDataBufferTypeArray: null | Uint32Array,
    workerXOtherData: any | null
}

export type states = {
    [pipelineName]: state,
}
