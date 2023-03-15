

import * as OptionSt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/OptionSt.bs.js";

var stateContainer = {
  state: undefined
};

function setState(state) {
  stateContainer.state = state;
}

function unsafeGetState(param) {
  return OptionSt$Commonlib.unsafeGet(stateContainer.state);
}

export {
  stateContainer ,
  setState ,
  unsafeGetState ,
}
/* No side effect */
