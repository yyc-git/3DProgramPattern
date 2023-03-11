


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

export {
  getBlockService ,
  createBlockState ,
  getDependentBlockProtocolNameMap ,
}
/* No side effect */
