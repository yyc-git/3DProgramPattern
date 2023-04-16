import {RenderEngine} from "./RenderEngine"

let _renderEngine: RenderEngine = null

export let getRenderEngine = (): RenderEngine => {
  return _renderEngine;
}

export let setRenderEngine = (renderEngine: RenderEngine) {
  _renderEngine = renderEngine;
}