type stateContainer = {mutable state: option<StateType.state>}

let stateContainer: stateContainer = {
  state: None,
}

let setState = (state: StateType.state) => {
  stateContainer.state = state->Some

  ()
}

let unsafeGetState = () => {
  stateContainer.state->Commonlib.OptionSt.unsafeGet
}
