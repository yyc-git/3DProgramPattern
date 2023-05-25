

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as ImmutableHashMap$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/hash_map/ImmutableHashMap.bs.js";

function createState(param) {
  return {
          blockServiceMap: ImmutableHashMap$Commonlib.createEmpty(undefined, undefined),
          blockStateMap: ImmutableHashMap$Commonlib.createEmpty(undefined, undefined)
        };
}

function getBlockServiceExn(state, blockProtocolName) {
  return ImmutableHashMap$Commonlib.getExn(state.blockServiceMap, blockProtocolName);
}

function getBlockStateExn(state, blockProtocolName) {
  return ImmutableHashMap$Commonlib.getExn(state.blockStateMap, blockProtocolName);
}

function setBlockState(state, blockProtocolName, blockState) {
  return {
          blockServiceMap: state.blockServiceMap,
          blockStateMap: ImmutableHashMap$Commonlib.set(state.blockStateMap, blockProtocolName, blockState)
        };
}

function _buildAPI(param) {
  return {
          getBlockService: getBlockServiceExn,
          getBlockState: getBlockStateExn,
          setBlockState: setBlockState
        };
}

function registerBlock(state, blockProtocolName, getBlockService, blockState) {
  var state_blockServiceMap = ImmutableHashMap$Commonlib.set(state.blockServiceMap, blockProtocolName, Curry._1(getBlockService, {
            getBlockService: getBlockServiceExn,
            getBlockState: getBlockStateExn,
            setBlockState: setBlockState
          }));
  var state_blockStateMap = state.blockStateMap;
  var state$1 = {
    blockServiceMap: state_blockServiceMap,
    blockStateMap: state_blockStateMap
  };
  return setBlockState(state$1, blockProtocolName, blockState);
}

export {
  createState ,
  getBlockServiceExn ,
  getBlockStateExn ,
  setBlockState ,
  _buildAPI ,
  registerBlock ,
}
/* No side effect */
