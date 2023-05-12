import * as Director from "./Director";
import * as SceneManager from "./SceneManager";

export let DirectorAPI = {
    createState: Director.createState,
    init: Director.init,
    loop: Director.loop
}

export let SceneAPI = {
    createScene: SceneManager.createScene
}
