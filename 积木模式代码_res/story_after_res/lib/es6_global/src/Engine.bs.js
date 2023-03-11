

import * as Director$Story_after_res from "./Director.bs.js";
import * as SceneManager$Story_after_res from "./SceneManager.bs.js";

var directorAPI = {
  createState: Director$Story_after_res.createState,
  init: Director$Story_after_res.init,
  loop: Director$Story_after_res.loop
};

var sceneAPI = {
  createScene: SceneManager$Story_after_res.createScene
};

export {
  directorAPI ,
  sceneAPI ,
}
/* No side effect */
