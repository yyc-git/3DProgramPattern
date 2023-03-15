type pipelineForRegister = StateType.pipeline<RegisterPipelineType.state> // Js.Nullable.t<RegisterPipelineType.config>,

type allRegisteredPipelines = list<StateType.registeredPipeline>

type exec = StateType.exec

type getExecs = list<StateType.getExec>

type jobOrder = {
  insertPipelineName: PipelineBasicType.pipelineName,
  insertElementName: PipelineBasicType.elementName,
  insertAction: RegisterPipelineType.insertAction,
}

type specificPipelineRelatedData = {
  pipelineName: PipelineBasicType.pipelineName,
  getExec: StateType.getExec,
  pipelineData: PipelineJsonType.pipelineData,
  jobOrder: option<jobOrder>,
}

type treeData = (list<TreeType.tree>, option<PipelineBasicType.pipelineName>)

type treeDataList = list<treeData>
