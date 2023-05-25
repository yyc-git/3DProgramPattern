open Block_manager_res.Main

let init = (): Block_manager_res.BlockManagerType.state => {
  createState()
  ->registerBlock(
    "engine_block_protocol_res",
    Engine_block_res.Main.getBlockService->Obj.magic,
    Engine_block_res.Main.createBlockState()->Obj.magic,
  )
  ->registerBlock(
    "director_block_protocol_res",
    Director_block_res.Main.getBlockService->Obj.magic,
    Director_block_res.Main.createBlockState()->Obj.magic,
  )
  ->registerBlock(
    "sceneManager_block_protocol_res",
    SceneManager_block_res.Main.getBlockService->Obj.magic,
    SceneManager_block_res.Main.createBlockState()->Obj.magic,
  )
  ->registerBlock(
    "render_block_protocol_res",
    Render_block_res.Main.getBlockService->Obj.magic,
    Render_block_res.Main.createBlockState()->Obj.magic,
  )
  ->registerBlock(
    "math_block_protocol_res",
    Math_block_res.Main.getBlockService->Obj.magic,
    Math_block_res.Main.createBlockState()->Obj.magic,
  )
}

let getEntryBlockProtocolName = () => "engine_block_protocol_res"

// type getBlockService<'blockService> = (
//   Block_manager_res.BlockManagerType.state,
//   Block_manager_res.BlockManagerType.blockProtocolName,
// ) => 'blockService

let getBlockService = (
  blockManagerState: Block_manager_res.BlockManagerType.state,
  blockProtocolName: Block_manager_res.BlockManagerType.blockProtocolName,
) => {
  getBlockServiceExn(blockManagerState, blockProtocolName)
}
