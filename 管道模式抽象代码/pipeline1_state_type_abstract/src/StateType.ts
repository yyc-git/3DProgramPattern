export const pipelineName = X Pipeline名

// PipelineState的类型
export type state = {
    ...
}

//该Pipeline的Job使用的所有PipelineState的类型
export type states = {
    [pipelineName]: state,

    [依赖的其它PipelineState的名称]: 依赖的其它PipelineState的state类型,
}