export const pipelineName = "JiaEngineInMobile"

//JiaEngineInMobilePipelineState的类型
export type state = {
    gl: WebGLRenderingContext | null
}

//states定义了在JiaEngineInMobilePipeline的所有的Job中需要调用的所有的PipelineState的类型
//因为目前只需要调用JiaEngineInMobilePipelineState，所以只定义了它的类型
export type states = {
    [pipelineName]: state,
}
