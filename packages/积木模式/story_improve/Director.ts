import { init as initScene, update } from "./SceneManager"

import { init as initRender, render } from "./Render"

export let init = () => {
    ...

    initScene()

    initRender()

    ...
}

export let loop = () => {
    ...

    update()

    render()

    ...
}