type link = [#merge | #concat]

type elementType = [#job | #group]

type element = {
  name: PipelineBasicType.elementName,
  type_: elementType,
  is_set_state: Js.Nullable.t<bool>,
}

type groupName = string

type group = {
  name: groupName,
  link: link,
  elements: array<element>,
}

type groups = array<group>

type pipelineData = {
  name: PipelineBasicType.pipelineName,
  groups: groups,
  first_group: groupName,
}
