'use strict';

var Curry = require("rescript/lib/js/curry.js");

function getBlockService(api, param) {
  var sceneManagerBlockProtocolName = param.sceneManagerBlockProtocolName;
  var directorBlockProtocolName = param.directorBlockProtocolName;
  return {
          director: {
            init: (function (blockManagerState) {
                var match = Curry._2(api.getBlockService, blockManagerState, directorBlockProtocolName);
                return Curry._1(match.init, blockManagerState);
              }),
            loop: (function (blockManagerState) {
                var match = Curry._2(api.getBlockService, blockManagerState, directorBlockProtocolName);
                Curry._1(match.loop, blockManagerState);
              })
          },
          scene: {
            createScene: (function (blockManagerState) {
                console.log(sceneManagerBlockProtocolName);
                var match = Curry._2(api.getBlockService, blockManagerState, sceneManagerBlockProtocolName);
                var sceneManagerState = Curry._2(api.getBlockState, blockManagerState, sceneManagerBlockProtocolName);
                return Curry._3(api.setBlockState, blockManagerState, sceneManagerBlockProtocolName, Curry._1(match.createScene, sceneManagerState));
              })
          }
        };
}

function createBlockState(param) {
  return null;
}

function getDependentBlockProtocolNameMap(param) {
  return {
          directorBlockProtocolName: "director_block_protocol_res",
          sceneManagerBlockProtocolName: "sceneManager_block_protocol_res"
        };
}

exports.getBlockService = getBlockService;
exports.createBlockState = createBlockState;
exports.getDependentBlockProtocolNameMap = getDependentBlockProtocolNameMap;
/* No side effect */
