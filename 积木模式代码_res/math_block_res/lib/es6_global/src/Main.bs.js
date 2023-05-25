


function getBlockService(api) {
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

export {
  getBlockService ,
  createBlockState ,
}
/* No side effect */
