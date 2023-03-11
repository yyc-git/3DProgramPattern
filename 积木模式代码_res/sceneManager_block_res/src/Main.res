let getBlockService: Block_manager_res.BlockManagerType.getBlockService<
  DependentMapType.dependentBlockProtocolNameMap,
  SceneManager_block_protocol_res.ServiceType.service,
> = (api, {mathBlockProtocolName}) => {
  createScene: sceneManagerState => {
    Js.log("创建场景")

    let sceneGameObject = Obj.magic(1)

    {
      ...sceneManagerState,
      allGameObjects: Js.Array.concat(sceneManagerState.allGameObjects, [sceneGameObject]),
    }
  },
  getAllGameObjects: sceneManagerState => {
    sceneManagerState.allGameObjects
  },
  init: blockManagerState => {
    Js.log("初始化场景")

    blockManagerState
  },
  update: blockManagerState => {
    Js.log("更新场景")

    let {multiplyMatrix}: Math_block_protocol_res.ServiceType.service = api.getBlockService(
      blockManagerState,
      mathBlockProtocolName,
    )

    let _ = multiplyMatrix(Obj.magic(1), Obj.magic(1))

    blockManagerState
  },
}

let createBlockState: Block_manager_res.BlockManagerType.createBlockState<
  SceneManager_block_protocol_res.StateType.state,
> = () => {
  allGameObjects: [],
}

let getDependentBlockProtocolNameMap: Block_manager_res.BlockManagerType.getDependentBlockProtocolNameMap<
  DependentMapType.dependentBlockProtocolNameMap,
> = () => {
  mathBlockProtocolName: "math_block_protocol_res",
}
