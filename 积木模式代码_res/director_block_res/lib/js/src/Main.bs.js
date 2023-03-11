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

function getBlockService(api, param) {
  var renderBlockProtocolName = param.renderBlockProtocolName;
  var sceneManagerBlockProtocolName = param.sceneManagerBlockProtocolName;
  return {
          init: (function (blockManagerState) {
              var sceneManagerService = Curry._2(api.getBlockService, blockManagerState, sceneManagerBlockProtocolName);
              var blockManagerState$1 = Curry._1(sceneManagerService.init, blockManagerState);
              var renderService = Curry._2(api.getBlockService, blockManagerState$1, renderBlockProtocolName);
              return Curry._1(renderService.init, blockManagerState$1);
            }),
          loop: (function (blockManagerState) {
              _loop(api, blockManagerState, sceneManagerBlockProtocolName, renderBlockProtocolName);
            })
        };
}

function createBlockState(param) {
  return null;
}

function getDependentBlockProtocolNameMap(param) {
  return {
          sceneManagerBlockProtocolName: "sceneManager_block_protocol_res",
          renderBlockProtocolName: "render_block_protocol_res"
        };
}

exports.requestAnimationFrame = requestAnimationFrame;
exports._loop = _loop;
exports.getBlockService = getBlockService;
exports.createBlockState = createBlockState;
exports.getDependentBlockProtocolNameMap = getDependentBlockProtocolNameMap;
/* No side effect */
