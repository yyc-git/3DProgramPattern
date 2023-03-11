open Engine

let engineState = directorAPI.createState()

let engineState = sceneAPI.createScene(engineState)

let engineState = directorAPI.init(engineState)

directorAPI.loop(engineState)
