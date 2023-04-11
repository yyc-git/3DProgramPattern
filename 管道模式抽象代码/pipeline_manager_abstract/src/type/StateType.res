type systemState

type jobName = string

type stream<'a> = Most.StreamType.stream<'a>

type allPipelineData = array<PipelineJsonType.pipelineData>

type rec state = {
  allRegisteredPipelines: list<registeredPipeline>,
  states: RegisterPipelineType.states,
}
and operateStatesFuncs = {
  getStatesFunc: systemState => RegisterPipelineType.states,
  setStatesFunc: (systemState, RegisterPipelineType.states) => systemState,
}
and createState<'pipelineState> = systemState => 'pipelineState
and exec = (systemState, operateStatesFuncs) => stream<systemState>

and getExec = (PipelineBasicType.pipelineName, jobName) => Js.Nullable.t<exec>

and pipeline<'pipelineState> = {
  pipelineName: PipelineBasicType.pipelineName,
  createState: createState<'pipelineState>,
  getExec: getExec,
  allPipelineData: allPipelineData,
}
and registeredPipeline = (pipeline<RegisterPipelineType.state>, RegisterPipelineType.jobOrders)
