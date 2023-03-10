import { createState, getBlockServiceExn, registerBlock } from "block_manager/src/Main"
import {
    getBlockService as getSceneManagerBlockService,
    getDependentBlockProtocolNameMap as getDependentSceneManagerBlockProtocolNameMap,
    createBlockState as createSceneManagerState
} from "sceneManager_block/src/Main"
import {
    getBlockService as getDirectorBlockService,
    getDependentBlockProtocolNameMap as getDependentDirectorBlockProtocolNameMap,
    createBlockState as createDirectorState
} from "director_block/src/Main"
import {
    getBlockService as getRenderBlockService,
    getDependentBlockProtocolNameMap as getDependentRenderBlockProtocolNameMap,
    createBlockState as createRenderState
} from "render_block/src/Main"
import {
    getBlockService as getEngineBlockService,
    getDependentBlockProtocolNameMap as getDependentEngineBlockProtocolNameMap,
    createBlockState as createEngineState
} from "engine_block/src/Main"
import {
    getBlockService as getMathBlockService,
    getDependentBlockProtocolNameMap as getDependentMathBlockProtocolNameMap,
    createBlockState as createMathState
} from "math_block/src/Main"
import { blockProtocolName, blockService, state as blockManagerState } from "block_manager/src/BlockManagerType"

export let init = (): blockManagerState => {
    let blockManagerState = createState()

    blockManagerState = registerBlock(
        blockManagerState,
        "engine_block_protocol",
        getEngineBlockService,
        getDependentEngineBlockProtocolNameMap(),
        createEngineState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "director_block_protocol",
        getDirectorBlockService,
        getDependentDirectorBlockProtocolNameMap(),
        createDirectorState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "sceneManager_block_protocol",
        getSceneManagerBlockService,
        getDependentSceneManagerBlockProtocolNameMap(),
        createSceneManagerState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "render_block_protocol",
        getRenderBlockService,
        getDependentRenderBlockProtocolNameMap(),
        createRenderState()
    )
    blockManagerState = registerBlock(
        blockManagerState,
        "math_block_protocol",
        getMathBlockService,
        getDependentMathBlockProtocolNameMap(),
        createMathState()
    )

    return blockManagerState
}


export let getEntryBlockProtocolName = () => "engine_block_protocol"

export let getBlockService = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName) => {
    return getBlockServiceExn<blockService>(blockManagerState, blockProtocolName)
}
