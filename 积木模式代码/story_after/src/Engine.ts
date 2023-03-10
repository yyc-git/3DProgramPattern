import { createState, init, loop } from "./Director";
import { createScene } from "./SceneManager";

export let DirectorAPI = {
    createState: createState,
    init: init,
    loop: loop
}

export let SceneAPI = {
    createScene: createScene
}
