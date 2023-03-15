type jobOrder = {
  insertElementName: PipelineBasicType.elementName,
  insertAction: RegisterPipelineType.insertAction,
}

type nodeData = {
  mutable getExecs: list<StateType.getExec>,
  mutable pipelineData: PipelineJsonType.pipelineData,
  jobOrder: option<jobOrder>,
}

type rec tree = Node(PipelineBasicType.pipelineName, nodeData, list<tree>)
