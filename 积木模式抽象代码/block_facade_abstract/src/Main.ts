import { createState, getBlockServiceExn, registerBlock } from "block_manager_abstract/src/Main"
import {
    getBlockService as getEntryBlockService,
    getDependentBlockProtocolNameMap as getDependentEntryBlockProtocolNameMap,
    createBlockState as createEntryBlockState
} from "entry_block_abstract/src/Main"
import {
    getBlockService as getBlock1Service,
    getDependentBlockProtocolNameMap as getDependentBlock1ProtocolNameMap,
    createBlockState as createBlock1State
} from "block1/src/Main"
import { blockProtocolName, state as blockManagerState } from "block_manager_abstract/src/BlockManagerType"

export let init = (): blockManagerState => {
    let blockManagerState = createState()

    blockManagerState = registerBlock(
        blockManagerState,
        "entry_block_abstract_protocol",
        getEntryBlockService,
        getDependentEntryBlockProtocolNameMap(),
        createEntryBlockState()
    )

    blockManagerState = registerBlock(
        blockManagerState,
        "block1_protocol",
        getBlock1Service,
        getDependentBlock1ProtocolNameMap(),
        createBlock1State()
    )
    注册更多的Block...

    return blockManagerState
}


export let getEntryBlockProtocolName = () => "entry_block_abstract_protocol"

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
