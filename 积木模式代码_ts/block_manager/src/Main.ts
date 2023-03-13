import { state, blockProtocolName, getBlockService, api } from "./BlockManagerType"
import { Map } from "immutable"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"

export let createState = (): state => {
    return {
        blockServiceMap: Map(),
        blockStateMap: Map()
    }
}

export let getBlockServiceExn = <blockService>(state: state, blockProtocolName: blockProtocolName): blockService => {
    return getExnFromStrictUndefined(state.blockServiceMap.get(blockProtocolName))
}

export let getBlockStateExn = <blockState>(state: state, blockProtocolName: blockProtocolName): blockState => {
    return getExnFromStrictUndefined(state.blockStateMap.get(blockProtocolName))
}

export let setBlockState = <blockState>(state: state, blockProtocolName: blockProtocolName, blockState: blockState): state => {
    return {
        ...state,
        blockStateMap: state.blockStateMap.set(blockProtocolName, blockState)
    }
}


let _buildAPI = (): api => {
    return {
        getBlockService: getBlockServiceExn,
        getBlockState: getBlockStateExn,
        setBlockState: setBlockState,
    }
}

export let registerBlock = <blockService, dependentBlockProtocolNameMap, blockState>(state: state, blockProtocolName: blockProtocolName, getBlockService: getBlockService<dependentBlockProtocolNameMap, blockService>,
    dependentBlockProtocolNameMap: dependentBlockProtocolNameMap,
    blockState: blockState
): state => {
    state = {
        ...state,
        blockServiceMap: state.blockServiceMap.set(blockProtocolName, getBlockService(
            _buildAPI(),
            dependentBlockProtocolNameMap
        ))
    }

    state = setBlockState(state, blockProtocolName, blockState)

    return state
}
