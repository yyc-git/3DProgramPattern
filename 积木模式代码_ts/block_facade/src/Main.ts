import * as BlockManager from "block_manager/src/Main"
import * as SceneManagerBlock from "sceneManager_block/src/Main"
import * as DirectorBlock from "director_block/src/Main"
import * as RenderBlock from "render_block/src/Main"
import * as EngineBlock from "engine_block/src/Main"
import * as MathBlock from "math_block/src/Main"
import { blockProtocolName, blockService, state as blockManagerState } from "block_manager/src/BlockManagerType"

export let init = (): blockManagerState => {
    let blockManagerState = BlockManager.createState()

    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "engine_block_protocol",
        EngineBlock.getBlockService,
        EngineBlock.getDependentBlockProtocolNameMap(),
        EngineBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "director_block_protocol",
        DirectorBlock.getBlockService,
        DirectorBlock.getDependentBlockProtocolNameMap(),
        DirectorBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "sceneManager_block_protocol",
        SceneManagerBlock.getBlockService,
        SceneManagerBlock.getDependentBlockProtocolNameMap(),
        SceneManagerBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "render_block_protocol",
        RenderBlock.getBlockService,
        RenderBlock.getDependentBlockProtocolNameMap(),
        RenderBlock.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "math_block_protocol",
        MathBlock.getBlockService,
        MathBlock.getDependentBlockProtocolNameMap(),
        MathBlock.createBlockState()
    )

    return blockManagerState
}

//获得Engine Block Protocol的协议名
export let getEntryBlockProtocolName = () => "engine_block_protocol"

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return BlockManager.getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
