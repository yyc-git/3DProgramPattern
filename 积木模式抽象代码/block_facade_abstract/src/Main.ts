import * as BlockManager from "block_manager_abstract/src/Main"
import * as EntryBlock from "entry_block_abstract/src/Main"
import * as Block1 from "block1/src/Main"
import { blockProtocolName, state as blockManagerState } from "block_manager_abstract/src/BlockManagerType"

export let init = (): blockManagerState => {
    let blockManagerState = BlockManager.createState()

    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "entry_block_protocol",
        EntryBlock.getBlockService,
        EntryBlock.getDependentBlockProtocolNameMap(),
        EntryBlock.createBlockState()
    )

    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "block1_protocol",
        Block1.getBlockService,
        Block1.getDependentBlockProtocolNameMap(),
        Block1.createBlockState()
    )
    注册更多的Block...

    return blockManagerState
}


export let getEntryBlockProtocolName = () => "entry_block_protocol"

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return BlockManager.getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
