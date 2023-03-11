type service = {
  createScene: StateType.state => StateType.state,
  getAllGameObjects: StateType.state => StateType.allGameObjects,
  init: Block_manager_res.BlockManagerType.state => Block_manager_res.BlockManagerType.state,
  update: Block_manager_res.BlockManagerType.state => Block_manager_res.BlockManagerType.state,
}
