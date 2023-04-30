import { config } from "./type/TargetConfigType";

export declare function parseConfig(configJson: JSON): config

type target = any

export declare function buildTarget(handleConfigFuncs, parsedConfig: config, targetChunk, someConfigData): target

type runtimeConfig = any

export declare function getRuntimeConfig(addRuntimeConfigFuncs, target: target): runtimeConfig