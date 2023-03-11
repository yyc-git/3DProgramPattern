open BlockManagerType

let createState = (): state => {
  {
    blockServiceMap: Commonlib.ImmutableHashMap.createEmpty(),
    blockStateMap: Commonlib.ImmutableHashMap.createEmpty(),
  }
}

let getBlockServiceExn = (state: state, blockProtocolName: blockProtocolName): blockService => {
  state.blockServiceMap->Commonlib.ImmutableHashMap.getExn(blockProtocolName)
}

let getBlockStateExn = (state: state, blockProtocolName: blockProtocolName): blockState => {
  state.blockStateMap->Commonlib.ImmutableHashMap.getExn(blockProtocolName)
}

let setBlockState = (
  state: state,
  blockProtocolName: blockProtocolName,
  blockState: blockState,
): state => {
  {
    ...state,
    blockStateMap: state.blockStateMap->Commonlib.ImmutableHashMap.set(
      blockProtocolName,
      blockState,
    ),
  }
}

let _buildAPI = (): api => {
  {
    getBlockService: getBlockServiceExn->Obj.magic,
    getBlockState: getBlockStateExn->Obj.magic,
    setBlockState: setBlockState->Obj.magic,
  }
}

// let registerBlock = (
//   state: state,
//   blockProtocolName: blockProtocolName,
//   getBlockService: getBlockService<dependentBlockProtocolNameMap, blockService>,
//   dependentBlockProtocolNameMap: dependentBlockProtocolNameMap,
//   blockState: blockState,
// ): state => {

let registerBlock = (
  state: state,
  blockProtocolName: blockProtocolName,
  getBlockService: getBlockService<dependentBlockProtocolNameMap, blockService>,
  dependentBlockProtocolNameMap: dependentBlockProtocolNameMap,
  blockState: blockState,
): state => {
  let state = {
    ...state,
    blockServiceMap: state.blockServiceMap->Commonlib.ImmutableHashMap.set(
      blockProtocolName,
      getBlockService(_buildAPI(), dependentBlockProtocolNameMap),
    ),
  }

  let state = setBlockState(state, blockProtocolName, blockState)

  state
}
