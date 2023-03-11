'use strict';

var Curry = require("rescript/lib/js/curry.js");
var ImmutableHashMap$Commonlib = require("commonlib/lib/js/src/structure/hash_map/ImmutableHashMap.bs.js");

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

function registerBlock(state, blockProtocolName, getBlockService, dependentBlockProtocolNameMap, blockState) {
  var state_blockServiceMap = ImmutableHashMap$Commonlib.set(state.blockServiceMap, blockProtocolName, Curry._2(getBlockService, {
            getBlockService: getBlockServiceExn,
            getBlockState: getBlockStateExn,
            setBlockState: setBlockState
          }, dependentBlockProtocolNameMap));
  var state_blockStateMap = state.blockStateMap;
  var state$1 = {
    blockServiceMap: state_blockServiceMap,
    blockStateMap: state_blockStateMap
  };
  return setBlockState(state$1, blockProtocolName, blockState);
}

exports.createState = createState;
exports.getBlockServiceExn = getBlockServiceExn;
exports.getBlockStateExn = getBlockStateExn;
exports.setBlockState = setBlockState;
exports._buildAPI = _buildAPI;
exports.registerBlock = registerBlock;
/* No side effect */
