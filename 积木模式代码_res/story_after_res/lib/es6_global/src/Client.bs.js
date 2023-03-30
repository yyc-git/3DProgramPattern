

import * as Engine$Story_after_res from "./Engine.bs.js";

var engineState = Engine$Story_after_res.directorAPI.createState(undefined);

var engineState$1 = Engine$Story_after_res.sceneAPI.createScene(engineState);

var engineState$2 = Engine$Story_after_res.directorAPI.init(engineState$1);

Engine$Story_after_res.directorAPI.loop(engineState$2);

export {
  engineState$2 as engineState,
}
/* engineState Not a pure module */
