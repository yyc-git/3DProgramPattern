

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";

function getBlockService(api) {
  return {
          director: {
            init: (function (blockManagerState) {
                var match = Curry._2(api.getBlockService, blockManagerState, "director_block_protocol_res");
                return Curry._1(match.init, blockManagerState);
              }),
            loop: (function (blockManagerState) {
                var match = Curry._2(api.getBlockService, blockManagerState, "director_block_protocol_res");
                Curry._1(match.loop, blockManagerState);
              })
          },
          scene: {
            createScene: (function (blockManagerState) {
                console.log("sceneManager_block_protocol_res");
                var match = Curry._2(api.getBlockService, blockManagerState, "sceneManager_block_protocol_res");
                var sceneManagerState = Curry._2(api.getBlockState, blockManagerState, "sceneManager_block_protocol_res");
                return Curry._3(api.setBlockState, blockManagerState, "sceneManager_block_protocol_res", Curry._1(match.createScene, sceneManagerState));
              })
          }
        };
}

function createBlockState(param) {
  return null;
}

export {
  getBlockService ,
  createBlockState ,
}
/* No side effect */
