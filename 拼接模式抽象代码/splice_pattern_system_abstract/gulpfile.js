var gulp = require("gulp");
var path = require("path");

gulp.task("createChunkFile_ts", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/ConverterdChunk.ts");
    var chunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createChunkFileForTs(chunkPathArray, chunkFilePath, done);
});

gulp.task("createChunkFile_res", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/ConverterdChunk.res");
    var chunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createChunkFileForRes(chunkPathArray, chunkFilePath, done);
});