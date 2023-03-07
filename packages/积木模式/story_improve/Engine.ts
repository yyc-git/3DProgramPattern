import { init, loop } from "./Director";
import { createScene } from "./SceneManager";

export let DirectorAPI = {
    init: init,
    loop: loop
}

export let SceneAPI = {
    createScene: createScene
}
