

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_array from "../../../../../node_modules/rescript/lib/es6/js_array.js";

function getBlockService(api) {
  return {
          createScene: (function (sceneManagerState) {
              console.log("创建场景");
              return {
                      allGameObjects: Js_array.concat(sceneManagerState.allGameObjects, [1])
                    };
            }),
          getAllGameObjects: (function (sceneManagerState) {
              return sceneManagerState.allGameObjects;
            }),
          init: (function (blockManagerState) {
              console.log("初始化场景");
              return blockManagerState;
            }),
          update: (function (blockManagerState) {
              console.log("更新场景");
              var match = Curry._2(api.getBlockService, blockManagerState, "math_block_protocol_res");
              Curry._2(match.multiplyMatrix, 1, 1);
              return blockManagerState;
            })
        };
}

function createBlockState(param) {
  return {
          allGameObjects: []
        };
}

export {
  getBlockService ,
  createBlockState ,
}
/* No side effect */
