import {Engine} from "./Engine"

let _engine: Engine = null

export let getEngine = (): Engine => {
  return _engine;
}

export let setEngine = (engine: Engine) {
  _engine = engine;
}