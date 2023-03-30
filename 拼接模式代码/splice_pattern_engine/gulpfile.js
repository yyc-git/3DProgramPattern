var gulp = require("gulp");
var path = require("path");

gulp.task("createChunkFile_ts", function (done) {
    var compiler = require("chunk_converter");

    var chunkFilePath = path.join(process.cwd(), "src/glsl/Chunk.ts");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    compiler.createChunkFileForTs(glslPathArray, chunkFilePath, done);
});

gulp.task("createChunkFile_res", function (done) {
    var compiler = require("chunk_converter");

    var chunkFilePath = path.join(process.cwd(), "src/glsl/Chunk.res");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    compiler.createChunkFileForRes(glslPathArray, chunkFilePath, done);
});