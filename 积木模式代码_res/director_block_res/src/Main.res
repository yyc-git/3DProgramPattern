//假实现
let requestAnimationFrame = func => ()

let rec _loop = (
  api: Block_manager_res.BlockManagerType.api,
  blockManagerState,
  sceneManagerBlockProtocolName,
  renderBlockProtocolName,
) => {
  let sceneManagerService: SceneManager_block_protocol_res.ServiceType.service = api.getBlockService(
    blockManagerState,
    sceneManagerBlockProtocolName,
  )

  let blockManagerState = sceneManagerService.update(blockManagerState)

  let renderService: Render_block_protocol_res.ServiceType.service = api.getBlockService(
    blockManagerState,
    renderBlockProtocolName,
  )

  let blockManagerState = renderService.render(blockManagerState)

  requestAnimationFrame(time => {
    _loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
  })
}

let getBlockService: Block_manager_res.BlockManagerType.getBlockService<
  DependentMapType.dependentBlockProtocolNameMap,
  Director_block_protocol_res.ServiceType.service,
> = (api, {sceneManagerBlockProtocolName, renderBlockProtocolName}) => {
  init: blockManagerState => {
    let sceneManagerService: SceneManager_block_protocol_res.ServiceType.service = api.getBlockService(
      blockManagerState,
      sceneManagerBlockProtocolName,
    )

    let blockManagerState = sceneManagerService.init(blockManagerState)

    let renderService: Render_block_protocol_res.ServiceType.service = api.getBlockService(
      blockManagerState,
      renderBlockProtocolName,
    )

    let blockManagerState = renderService.init(blockManagerState)

    blockManagerState
  },
  loop: blockManagerState => {
    _loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName)
  },
}

let createBlockState: Block_manager_res.BlockManagerType.createBlockState<
  Director_block_protocol_res.StateType.state,
> = () => {
  Js.Nullable.null->Obj.magic
}

let getDependentBlockProtocolNameMap: Block_manager_res.BlockManagerType.getDependentBlockProtocolNameMap<
  DependentMapType.dependentBlockProtocolNameMap,
> = () => {
  sceneManagerBlockProtocolName: "sceneManager_block_protocol_res",
  renderBlockProtocolName: "render_block_protocol_res",
}
