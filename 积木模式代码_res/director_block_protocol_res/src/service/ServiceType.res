type service = {
  init: Block_manager_res.BlockManagerType.state => Block_manager_res.BlockManagerType.state,
  loop: Block_manager_res.BlockManagerType.state => unit,
}
