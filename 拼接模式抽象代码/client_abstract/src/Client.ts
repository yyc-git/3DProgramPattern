// use json loader to load config
import * as configJson from "./target_config/config.json"

import { parseConfig, createState, init, operateWhenLoop } from "splice_pattern_system_abstract/src/Main"

let parsedConfig = parseConfig(configJson)

let state = createState(parsedConfig)

declare let someConfigData
state = init(state, someConfigData)

state = operateWhenLoop(state)