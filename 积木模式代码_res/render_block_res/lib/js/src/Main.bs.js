'use strict';

var Curry = require("rescript/lib/js/curry.js");

function getBlockService(api, param) {
  var mathBlockProtocolName = param.mathBlockProtocolName;
  var sceneManagerBlockProtocolName = param.sceneManagerBlockProtocolName;
  return {
          init: (function (blockManagerState) {
              console.log("初始化渲染");
              return blockManagerState;
            }),
          render: (function (blockManagerState) {
              var match = Curry._2(api.getBlockService, blockManagerState, sceneManagerBlockProtocolName);
              var sceneManagerState = Curry._2(api.getBlockState, blockManagerState, sceneManagerBlockProtocolName);
              Curry._1(match.getAllGameObjects, sceneManagerState);
              console.log("处理场景数据");
              var match$1 = Curry._2(api.getBlockService, blockManagerState, mathBlockProtocolName);
              Curry._2(match$1.multiplyMatrix, 1, 1);
              console.log("渲染");
              return blockManagerState;
            })
        };
}

function createBlockState(param) {
  return null;
}

function getDependentBlockProtocolNameMap(param) {
  return {
          sceneManagerBlockProtocolName: "sceneManager_block_protocol_res",
          mathBlockProtocolName: "math_block_protocol_res"
        };
}

exports.getBlockService = getBlockService;
exports.createBlockState = createBlockState;
exports.getDependentBlockProtocolNameMap = getDependentBlockProtocolNameMap;
/* No side effect */
