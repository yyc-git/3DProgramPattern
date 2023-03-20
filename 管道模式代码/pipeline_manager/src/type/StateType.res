type worldState

type jobName = string

type stream<'a> = Most.StreamType.stream<'a>

type allPipelineData = array<PipelineJsonType.pipelineData>

type rec state = {
  allRegisteredPipelines: list<registeredPipeline>,
  states: RegisterPipelineType.states,
}
and operateStatesFuncs = {
  getStatesFunc: worldState => RegisterPipelineType.states,
  setStatesFunc: (worldState, RegisterPipelineType.states) => worldState,
}
and createState<'pipelineState> = state => 'pipelineState
and exec = (worldState, operateStatesFuncs) => stream<worldState>

and getExec = (PipelineBasicType.pipelineName, jobName) => Js.Nullable.t<exec>

and pipeline<'pipelineState> = {
  pipelineName: PipelineBasicType.pipelineName,
  createState: createState<'pipelineState>,
  getExec: getExec,
  allPipelineData: allPipelineData,
}
and registeredPipeline = (pipeline<RegisterPipelineType.state>, RegisterPipelineType.jobOrders)
