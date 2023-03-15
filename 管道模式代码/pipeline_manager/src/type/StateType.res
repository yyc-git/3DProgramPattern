type jobName = string

type stream<'a> = Most.StreamType.stream<'a>

type allPipelineData = array<PipelineJsonType.pipelineData>

type rec state = {
  allRegisteredPipelines: list<registeredPipeline>,
  states: RegisterPipelineType.states,
}
and operateStatesFuncs = {
  getStatesFunc: state => RegisterPipelineType.states,
  setStatesFunc: (state, RegisterPipelineType.states) => state,
}
and createState<'pipelineState> = state => 'pipelineState
and exec = (state, operateStatesFuncs) => stream<state>

and getExec = (PipelineBasicType.pipelineName, jobName) => Js.Nullable.t<exec>

and pipeline<'pipelineState> = {
  pipelineName: PipelineBasicType.pipelineName,
  createState: createState<'pipelineState>,
  getExec: getExec,
  allPipelineData: allPipelineData,
}
and registeredPipeline = (pipeline<RegisterPipelineType.state>, RegisterPipelineType.jobOrders)
