'use strict';

var Js_array = require("rescript/lib/js/js_array.js");
var Math$Story_after_res = require("./Math.bs.js");

function createState(param) {
  return {
          allGameObjects: []
        };
}

function createScene(state) {
  console.log("创建场景");
  return {
          scene: {
            allGameObjects: Js_array.concat(state.scene.allGameObjects, [1])
          }
        };
}

function getAllGameObjects(state) {
  return state.scene.allGameObjects;
}

function init(state) {
  console.log("初始化场景");
  return state;
}

function update(state) {
  console.log("更新场景");
  Math$Story_after_res.multiplyMatrix(1, 1);
  return state;
}

exports.createState = createState;
exports.createScene = createScene;
exports.getAllGameObjects = getAllGameObjects;
exports.init = init;
exports.update = update;
/* No side effect */
