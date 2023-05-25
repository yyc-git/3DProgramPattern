import { state, blockProtocolName, getBlockService } from "./BlockManagerType"

export declare function createState(): state

export declare function getBlockServiceExn<blockService>(state: state, blockProtocolName: blockProtocolName): blockService

export declare function getBlockStateExn<blockState>(state: state, blockProtocolName: blockProtocolName): blockState

export declare function setBlockState<blockState>(state: state, blockProtocolName: blockProtocolName, blockState: blockState): state

export declare function registerBlock<blockService, blockState>(state: state, blockProtocolName: blockProtocolName, getBlockService: getBlockService<blockService>,
    blockState: blockState
): state
