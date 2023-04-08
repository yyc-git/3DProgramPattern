import { init, getEntryBlockProtocolName, getBlockService } from "block_facade_abstract/src/Main";
import { service } from "entry_block_abstract_protocol/src/service/ServiceType";

let blockManagerState = init()

let entryBlockService = getBlockService<service>(blockManagerState, getEntryBlockProtocolName())

调用entryBlockService...