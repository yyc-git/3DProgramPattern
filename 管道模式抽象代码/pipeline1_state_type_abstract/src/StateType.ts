export const pipelineName = 管道名

export type state = {
    管道State的类型...
}

export type states = {
    [pipelineName]: state,

    [依赖的其它管道的名称]: 依赖的其它管道的State的类型,
    更多依赖的管道...
}
