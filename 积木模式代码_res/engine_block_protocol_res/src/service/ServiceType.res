type directorAPI = {
  init: Block_manager_res.BlockManagerType.state => Block_manager_res.BlockManagerType.state,
  loop: Block_manager_res.BlockManagerType.state => unit,
}

type sceneAPI = {
  createScene: Block_manager_res.BlockManagerType.state => Block_manager_res.BlockManagerType.state,
}

type service = {
  director: directorAPI,
  scene: sceneAPI,
}
