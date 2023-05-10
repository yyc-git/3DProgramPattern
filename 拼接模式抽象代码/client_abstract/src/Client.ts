// use webpack's json loader to load target config
import * as targetsConfigJson from "./target_config/targets_config.json"
import * as chunksConfigJson from "./target_config/chunks_config.json"

import * as System from "splice_pattern_system_abstract/src/System"

let parsedConfig = System.parseConfig(targetsConfigJson, chunksConfigJson)

let state = System.createState(parsedConfig)

declare let someConfigData
state = System.init(state, someConfigData)

state = System.operateWhenRuntime(state)