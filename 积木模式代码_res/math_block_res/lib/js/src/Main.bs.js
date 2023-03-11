'use strict';


function getBlockService(api, param) {
  return {
          multiplyMatrix: (function (mat1, mat2) {
              console.log("计算");
              return 1;
            })
        };
}

function createBlockState(param) {
  return null;
}

function getDependentBlockProtocolNameMap(param) {
  return {};
}

exports.getBlockService = getBlockService;
exports.createBlockState = createBlockState;
exports.getDependentBlockProtocolNameMap = getDependentBlockProtocolNameMap;
/* No side effect */
