type directorAPI = {
  createState: unit => EngineStateType.state,
  init: EngineStateType.state => EngineStateType.state,
  loop: EngineStateType.state => unit,
}

type sceneAPI = {createScene: EngineStateType.state => EngineStateType.state}

let directorAPI: directorAPI = {
  createState: Director.createState,
  init: Director.init,
  loop: Director.loop,
}

let sceneAPI: sceneAPI = {
  createScene: SceneManager.createScene,
}
