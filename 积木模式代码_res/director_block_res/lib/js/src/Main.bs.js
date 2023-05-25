'use strict';

var Curry = require("rescript/lib/js/curry.js");

function requestAnimationFrame(func) {
  
}

function _loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName) {
  var sceneManagerService = Curry._2(api.getBlockService, blockManagerState, sceneManagerBlockProtocolName);
  var blockManagerState$1 = Curry._1(sceneManagerService.update, blockManagerState);
  var renderService = Curry._2(api.getBlockService, blockManagerState$1, renderBlockProtocolName);
  Curry._1(renderService.render, blockManagerState$1);
}

function getBlockService(api) {
  return {
          init: (function (blockManagerState) {
              var sceneManagerService = Curry._2(api.getBlockService, blockManagerState, "sceneManager_block_protocol_res");
              var blockManagerState$1 = Curry._1(sceneManagerService.init, blockManagerState);
              var renderService = Curry._2(api.getBlockService, blockManagerState$1, "render_block_protocol_res");
              return Curry._1(renderService.init, blockManagerState$1);
            }),
          loop: (function (blockManagerState) {
              _loop(api, blockManagerState, "sceneManager_block_protocol_res", "render_block_protocol_res");
            })
        };
}

function createBlockState(param) {
  return null;
}

exports.requestAnimationFrame = requestAnimationFrame;
exports._loop = _loop;
exports.getBlockService = getBlockService;
exports.createBlockState = createBlockState;
/* No side effect */
