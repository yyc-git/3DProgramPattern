import * as BlockFacade from "block_facade/src/Main";
import { service } from "engine_block_protocol/src/service/ServiceType";

let blockManagerState = BlockFacade.init()

//获得了入口积木（Engine Block）的服务
let { director, scene } = BlockFacade.getBlockService<service>(blockManagerState, BlockFacade.getEntryBlockProtocolName())

blockManagerState = scene.createScene(blockManagerState)

blockManagerState = director.init(blockManagerState)

director.loop(blockManagerState)