'use strict';


function init(param) {
  console.log("初始化");
}

function loop(param) {
  console.log("主循环");
}

exports.init = init;
exports.loop = loop;
/* No side effect */
