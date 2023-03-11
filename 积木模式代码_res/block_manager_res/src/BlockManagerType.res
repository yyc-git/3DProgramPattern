type blockName = string

type blockProtocolName = string

type blockService

type blockState

type dependentBlockProtocolNameMap

type state = {
  blockServiceMap: CommonlibType.ImmutableHashMapType.t<blockProtocolName, blockService>,
  blockStateMap: CommonlibType.ImmutableHashMapType.t<blockProtocolName, blockState>,
}

type api = {
  getBlockService: 'blockService. (state, blockProtocolName) => 'blockService,
  getBlockState: 'blockState. (state, blockProtocolName) => 'blockState,
  setBlockState: 'blockState. (state, blockProtocolName, 'blockState) => state,
}

type getBlockService<'dependentBlockProtocolNameMap, 'blockService> = (
  api,
  'dependentBlockProtocolNameMap,
) => 'blockService

type createBlockState<'blockState> = unit => 'blockState

type dependentBlockProtocolNameMapKey = string

type getDependentBlockProtocolNameMap<
  'dependentBlockProtocolNameMap,
> = unit => 'dependentBlockProtocolNameMap
