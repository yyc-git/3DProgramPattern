'use strict';

var Director$Story_before = require("./Director.bs.js");

var directorAPI = {
  init: Director$Story_before.init,
  loop: Director$Story_before.loop
};

exports.directorAPI = directorAPI;
/* No side effect */
