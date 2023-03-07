import { Map } from "immutable"

// createMap: () => Map(),
// mapSet: (map, key, value) => map.set(key, value),
// mapGet: (map, key) => map.get(key)

// +getEntryBlockProtocolName()
//     + getBlockService(state, blockProtocolName)
//     + getBlockState(state, blockProtocolName)
//     + registerBlock(state, blockProtocolName, blockService)

export let getEntryBlockProtocolName = (): string => {
    return "engine-block-protocol"
}

//TODO explain state
TODO finish:
dependentMap

export let getBlockService = (state, blockProtocolName) => {
    // return "engine-block-protocol"
    return state.blockServiceMap.get(blockProtocolName)
}

export let getEntryBlockProtocolName = (): string => {
    return "engine-block-protocol"
}
