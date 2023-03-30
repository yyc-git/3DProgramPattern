type state

type states = CommonlibType.ImmutableHashMapType.t<PipelineBasicType.pipelineName, state>

// type insertAction =
//   | Before
//   | After
type insertAction = [#before | #after]

type jobOrder = {
  pipelineName: PipelineBasicType.pipelineName,
  insertElementName: PipelineBasicType.elementName,
  insertAction: insertAction,
}

type jobOrders = array<jobOrder>
