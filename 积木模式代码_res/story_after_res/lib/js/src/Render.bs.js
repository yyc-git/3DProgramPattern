'use strict';

var Math$Story_after_res = require("./Math.bs.js");
var SceneManager$Story_after_res = require("./SceneManager.bs.js");

function init(engineState) {
  console.log("初始化渲染");
  return engineState;
}

function render(engineState) {
  SceneManager$Story_after_res.getAllGameObjects(engineState);
  console.log("处理场景数据");
  Math$Story_after_res.multiplyMatrix(1, 2);
  console.log("渲染");
  return engineState;
}

exports.init = init;
exports.render = render;
/* No side effect */
