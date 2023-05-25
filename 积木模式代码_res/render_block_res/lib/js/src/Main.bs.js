'use strict';

var Curry = require("rescript/lib/js/curry.js");

function getBlockService(api) {
  return {
          init: (function (blockManagerState) {
              console.log("初始化渲染");
              return blockManagerState;
            }),
          render: (function (blockManagerState) {
              var match = Curry._2(api.getBlockService, blockManagerState, "sceneManager_block_protocol_res");
              var sceneManagerState = Curry._2(api.getBlockState, blockManagerState, "sceneManager_block_protocol_res");
              Curry._1(match.getAllGameObjects, sceneManagerState);
              console.log("处理场景数据");
              var match$1 = Curry._2(api.getBlockService, blockManagerState, "math_block_protocol_res");
              Curry._2(match$1.multiplyMatrix, 1, 1);
              console.log("渲染");
              return blockManagerState;
            })
        };
}

function createBlockState(param) {
  return null;
}

exports.getBlockService = getBlockService;
exports.createBlockState = createBlockState;
/* No side effect */
