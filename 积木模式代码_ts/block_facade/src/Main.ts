import * as BlockManager from "block_manager/src/Main"
import * as SceneManagerBlockImplement from "sceneManager_block_implement/src/Main"
import * as DirectorBlockImplement from "director_block_implement/src/Main"
import * as RenderBlockImplement from "render_block_implement/src/Main"
import * as EngineBlockImplement from "engine_block_implement/src/Main"
import * as MathBlockImplement from "math_block_implement/src/Main"
import { blockProtocolName, blockService, state as blockManagerState } from "block_manager/src/BlockManagerType"

export let init = (): blockManagerState => {
    let blockManagerState = BlockManager.createState()

    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "engine_block_protocol",
        EngineBlockImplement.getBlockService,
        EngineBlockImplement.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "director_block_protocol",
        DirectorBlockImplement.getBlockService,
        DirectorBlockImplement.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "sceneManager_block_protocol",
        SceneManagerBlockImplement.getBlockService,
        SceneManagerBlockImplement.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "render_block_protocol",
        RenderBlockImplement.getBlockService,
        RenderBlockImplement.createBlockState()
    )
    blockManagerState = BlockManager.registerBlock(
        blockManagerState,
        "math_block_protocol",
        MathBlockImplement.getBlockService,
        MathBlockImplement.createBlockState()
    )

    return blockManagerState
}

//获得Engine Block Protocol的协议名
export let getEntryBlockProtocolName = () => "engine_block_protocol"

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return BlockManager.getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
