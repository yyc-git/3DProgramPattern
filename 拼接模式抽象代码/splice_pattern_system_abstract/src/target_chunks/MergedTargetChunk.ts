import { chunk } from "chunk_converter_abstract/src/ChunkType";
import { chunkName } from "chunk_handler_abstract/src/type/TargetConfigType";

let _buildChunk =
    (
        part1: string,
        part2: string,
        ...
    ):chunk => {
        return {
            part1,
            part2,
            ...
        }
    };

export let getData = (): Record<chunkName, chunk> => {

    return {
        "chunk1": _buildChunk("...", "...", ...),
        ... 
    }
}