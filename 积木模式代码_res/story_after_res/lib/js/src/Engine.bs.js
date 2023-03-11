'use strict';

var Director$Story_after_res = require("./Director.bs.js");
var SceneManager$Story_after_res = require("./SceneManager.bs.js");

var directorAPI = {
  createState: Director$Story_after_res.createState,
  init: Director$Story_after_res.init,
  loop: Director$Story_after_res.loop
};

var sceneAPI = {
  createScene: SceneManager$Story_after_res.createScene
};

exports.directorAPI = directorAPI;
exports.sceneAPI = sceneAPI;
/* No side effect */
