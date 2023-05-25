import type { Map } from "immutable";

export type blockName = string

export type blockProtocolName = string

export type blockService = any

export type blockState = any

export type state = {
  blockServiceMap: Map<blockProtocolName, blockService>,
  blockStateMap: Map<blockProtocolName, blockState>
}


export type api = {
  getBlockService<blockService>(state: state, blockProtocolName: blockProtocolName): blockService,
  getBlockState<blockState>(state: state, blockProtocolName: blockProtocolName): blockState,
  setBlockState<blockState>(state: state, blockProtocolName: blockProtocolName, blockState: blockState): state
};

export type getBlockService<blockService> = (api: api) => blockService;

export type createBlockState<blockState> = () => blockState;