import {IRenderEngine} from "./IRenderEngine"

let _renderEngine: IRenderEngine = null

export let getRenderEngine = (): IRenderEngine => {
  return _renderEngine;
}

export let setRenderEngine = (renderEngine: IRenderEngine) {
  _renderEngine = renderEngine;
}