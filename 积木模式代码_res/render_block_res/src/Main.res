let getBlockService: Block_manager_res.BlockManagerType.getBlockService<
  Render_block_protocol_res.ServiceType.service,
> = api => {
  init: blockManagerState => {
    Js.log("初始化渲染")

    blockManagerState
  },
  render: blockManagerState => {
    let {
      getAllGameObjects,
    }: SceneManager_block_protocol_res.ServiceType.service = api.getBlockService(
      blockManagerState,
      "sceneManager_block_protocol_res",
    )

    let sceneManagerState: SceneManager_block_protocol_res.StateType.state = api.getBlockState(
      blockManagerState,
      "sceneManager_block_protocol_res",
    )
    let allGameObjects = getAllGameObjects(sceneManagerState)

    Js.log("处理场景数据")

    let {multiplyMatrix}: Math_block_protocol_res.ServiceType.service = api.getBlockService(
      blockManagerState,
      "math_block_protocol_res",
    )

    let _ = multiplyMatrix(Obj.magic(1), Obj.magic(1))

    Js.log("渲染")

    blockManagerState
  },
}

let createBlockState: Block_manager_res.BlockManagerType.createBlockState<
  Render_block_protocol_res.StateType.state,
> = () => {
  Js.Nullable.null->Obj.magic
}
