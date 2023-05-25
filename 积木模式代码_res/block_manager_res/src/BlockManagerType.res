type blockName = string

type blockProtocolName = string

type blockService

type blockState

type state = {
  blockServiceMap: CommonlibType.ImmutableHashMapType.t<blockProtocolName, blockService>,
  blockStateMap: CommonlibType.ImmutableHashMapType.t<blockProtocolName, blockState>,
}

type api = {
  getBlockService: 'blockService. (state, blockProtocolName) => 'blockService,
  getBlockState: 'blockState. (state, blockProtocolName) => 'blockState,
  setBlockState: 'blockState. (state, blockProtocolName, 'blockState) => state,
}

type getBlockService<'blockService> = api => 'blockService

type createBlockState<'blockState> = unit => 'blockState
