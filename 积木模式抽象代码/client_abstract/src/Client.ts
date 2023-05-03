import * as BlockFacade from "block_facade_abstract/src/Main";
import { service } from "entry_block_abstract_protocol/src/service/ServiceType";

let blockManagerState = BlockFacade.init()

let entryBlockService = BlockFacade.getBlockService<service>(blockManagerState, BlockFacade.getEntryBlockProtocolName())

调用entryBlockService...