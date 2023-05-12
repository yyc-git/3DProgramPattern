import { state as blockManagerState, blockProtocolName, getBlockService, api } from "./BlockManagerType"
import { Map } from "immutable"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"

export let createState = (): blockManagerState => {
    return {
        blockServiceMap: Map(),
        blockStateMap: Map()
    }
}

export let getBlockServiceExn = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName): blockService => {
    return getExnFromStrictUndefined(blockManagerState.blockServiceMap.get(blockProtocolName))
}

export let getBlockStateExn = <blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName): blockState => {
    return getExnFromStrictUndefined(blockManagerState.blockStateMap.get(blockProtocolName))
}

export let setBlockState = <blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, blockState: blockState): blockManagerState => {
    return {
        ...blockManagerState,
        blockStateMap: blockManagerState.blockStateMap.set(blockProtocolName, blockState)
    }
}

let _buildAPI = (): api => {
    return {
        getBlockService: getBlockServiceExn,
        getBlockState: getBlockStateExn,
        setBlockState: setBlockState,
    }
}

export let registerBlock = <blockService, dependentBlockProtocolNameMap, blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, getBlockService: getBlockService<dependentBlockProtocolNameMap, blockService>,
    dependentBlockProtocolNameMap: dependentBlockProtocolNameMap,
    blockState: blockState
): blockManagerState => {
    blockManagerState = {
        ...blockManagerState,
        blockServiceMap: blockManagerState.blockServiceMap.set(blockProtocolName, getBlockService(
            _buildAPI(),
            dependentBlockProtocolNameMap
        ))
    }

    blockManagerState = setBlockState(blockManagerState, blockProtocolName, blockState)

    return blockManagerState
}
