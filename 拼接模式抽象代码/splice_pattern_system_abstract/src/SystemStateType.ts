import { chunk } from "chunk_converter_abstract/src/ChunkType";
import { chunkName } from "chunk_handler_abstract/src/type/TargetConfigType";

export type state = {
    parsedConfig
    chunk: Record<chunkName, chunk>,

    target:any,
    runtimeMetadata:any,

    更多字段...
}