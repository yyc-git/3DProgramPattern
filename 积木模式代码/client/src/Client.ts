import { init, getEntryBlockProtocolName, getBlockService } from "block_facade/src/Main";
import { service } from "engine_block_protocol/src/service/ServiceType";

let blockManagerState = init()

let { director, scene } = getBlockService<service>(blockManagerState, getEntryBlockProtocolName())

blockManagerState = scene.createScene(blockManagerState)

blockManagerState = director.init(blockManagerState)

director.loop(blockManagerState)