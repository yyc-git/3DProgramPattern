import { DirectorAPI, SceneAPI } from "./Engine"

let engineState = DirectorAPI.createState()

engineState = SceneAPI.createScene(engineState)

engineState = DirectorAPI.init(engineState)

DirectorAPI.loop(engineState)