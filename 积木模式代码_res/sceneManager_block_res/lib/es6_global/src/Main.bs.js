

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_array from "../../../../../node_modules/rescript/lib/es6/js_array.js";

function getBlockService(api, param) {
  var mathBlockProtocolName = param.mathBlockProtocolName;
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
              var match = Curry._2(api.getBlockService, blockManagerState, mathBlockProtocolName);
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

function getDependentBlockProtocolNameMap(param) {
  return {
          mathBlockProtocolName: "math_block_protocol_res"
        };
}

export {
  getBlockService ,
  createBlockState ,
  getDependentBlockProtocolNameMap ,
}
/* No side effect */
