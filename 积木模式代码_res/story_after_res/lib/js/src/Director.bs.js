'use strict';

var Render$Story_after_res = require("./Render.bs.js");
var SceneManager$Story_after_res = require("./SceneManager.bs.js");

function createState(param) {
  return {
          scene: SceneManager$Story_after_res.createState(undefined)
        };
}

function init(engineState) {
  return Render$Story_after_res.init(SceneManager$Story_after_res.init(engineState));
}

function requestAnimationFrame(func) {
  
}

function loop(engineState) {
  var engineState$1 = SceneManager$Story_after_res.update(engineState);
  Render$Story_after_res.render(engineState$1);
}

exports.createState = createState;
exports.init = init;
exports.requestAnimationFrame = requestAnimationFrame;
exports.loop = loop;
/* No side effect */
