var gulp = require("gulp");
var path = require("path");

//create for typescript
gulp.task("createChunkFile_ts", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/MergedTargetChunk.ts");
    var chunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createChunkFileForTs(chunkPathArray, chunkFilePath, done);
});

//create for rescript
gulp.task("createChunkFile_res", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/MergedTargetChunk.res");
    var chunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createChunkFileForRes(chunkPathArray, chunkFilePath, done);
});