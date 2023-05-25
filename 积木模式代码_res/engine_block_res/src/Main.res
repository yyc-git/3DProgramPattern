let getBlockService: Block_manager_res.BlockManagerType.getBlockService<
  Engine_block_protocol_res.ServiceType.service,
> = api => {
  director: {
    init: blockManagerState => {
      let {init}: Director_block_protocol_res.ServiceType.service = api.getBlockService(
        blockManagerState,
        "director_block_protocol_res",
      )

      init(blockManagerState)
    },
    loop: blockManagerState => {
      let {loop}: Director_block_protocol_res.ServiceType.service = api.getBlockService(
        blockManagerState,
        "director_block_protocol_res",
      )

      loop(blockManagerState)
    },
  },
  scene: {
    createScene: blockManagerState => {
      Js.log("sceneManager_block_protocol_res")
      let {createScene}: SceneManager_block_protocol_res.ServiceType.service = api.getBlockService(
        blockManagerState,
        "sceneManager_block_protocol_res",
      )

      let sceneManagerState: SceneManager_block_protocol_res.StateType.state = api.getBlockState(
        blockManagerState,
        "sceneManager_block_protocol_res",
      )

      api.setBlockState(
        blockManagerState,
        "sceneManager_block_protocol_res",
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
