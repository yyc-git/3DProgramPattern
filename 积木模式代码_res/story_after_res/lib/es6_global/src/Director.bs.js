

import * as Render$Story_after_res from "./Render.bs.js";
import * as SceneManager$Story_after_res from "./SceneManager.bs.js";

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

export {
  createState ,
  init ,
  requestAnimationFrame ,
  loop ,
}
/* No side effect */
