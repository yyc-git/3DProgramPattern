var gulp = require("gulp");
var path = require("path");

//create for typescript
gulp.task("createMergedTargetChunkFile_ts", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/MergedTargetChunk.ts");
    var targetChunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createMergedTargetChunkFileForTs(targetChunkPathArray, chunkFilePath, done);
});

//create for rescript
gulp.task("createMergedTargetChunkFile_res", function (done) {
    var compiler = require("chunk_converter_abstract");

    var chunkFilePath = path.join(process.cwd(), "src/target_chunks/MergedTargetChunk.res");
    var targetChunkPathArray = [path.join(process.cwd(), "src/target_chunks/**/*")];

    compiler.createMergedTargetChunkFileForRes(targetChunkPathArray, chunkFilePath, done);
});