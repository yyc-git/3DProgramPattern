'use strict';

var OptionSt$Commonlib = require("commonlib/lib/js/src/structure/OptionSt.bs.js");

var stateContainer = {
  state: undefined
};

function setState(state) {
  stateContainer.state = state;
}

function unsafeGetState(param) {
  return OptionSt$Commonlib.unsafeGet(stateContainer.state);
}

exports.stateContainer = stateContainer;
exports.setState = setState;
exports.unsafeGetState = unsafeGetState;
/* No side effect */
