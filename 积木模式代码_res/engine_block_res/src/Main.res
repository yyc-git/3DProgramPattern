let getBlockService: Block_manager_res.BlockManagerType.getBlockService<
  DependentMapType.dependentBlockProtocolNameMap,
  Engine_block_protocol_res.ServiceType.service,
> = (api, {directorBlockProtocolName, sceneManagerBlockProtocolName}) => {
  director: {
    init: blockManagerState => {
      let {init}: Director_block_protocol_res.ServiceType.service = api.getBlockService(
        blockManagerState,
        directorBlockProtocolName,
      )

      init(blockManagerState)
    },
    loop: blockManagerState => {
      let {loop}: Director_block_protocol_res.ServiceType.service = api.getBlockService(
        blockManagerState,
        directorBlockProtocolName,
      )

      loop(blockManagerState)
    },
  },
  scene: {
    createScene: blockManagerState => {
      Js.log(sceneManagerBlockProtocolName)
      let {createScene}: SceneManager_block_protocol_res.ServiceType.service = api.getBlockService(
        blockManagerState,
        sceneManagerBlockProtocolName,
      )

      let sceneManagerState: SceneManager_block_protocol_res.StateType.state = api.getBlockState(
        blockManagerState,
        sceneManagerBlockProtocolName,
      )

      api.setBlockState(
        blockManagerState,
        sceneManagerBlockProtocolName,
        createScene(sceneManagerState),
      )
    },
  },
}

let createBlockState: Block_manager_res.BlockManagerType.createBlockState<
  Engine_block_protocol_res.StateType.state,
> = () => {
  Js.Nullable.null->Obj.magic
}

let getDependentBlockProtocolNameMap: Block_manager_res.BlockManagerType.getDependentBlockProtocolNameMap<
  DependentMapType.dependentBlockProtocolNameMap,
> = () => {
  directorBlockProtocolName: "director_block_protocol_res",
  sceneManagerBlockProtocolName: "sceneManager_block_protocol_res",
}
