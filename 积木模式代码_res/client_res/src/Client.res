let blockManagerState = Block_facade_res.Main.init()

let {director, scene}: Engine_block_protocol_res.ServiceType.service =
  Block_facade_res.Main.getBlockService(
    blockManagerState,
    Block_facade_res.Main.getEntryBlockProtocolName(),
  )->Obj.magic

let blockManagerState = scene.createScene(blockManagerState)

let blockManagerState = director.init(blockManagerState)

director.loop(blockManagerState)
