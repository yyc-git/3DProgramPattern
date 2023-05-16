var gulp = require("gulp");
var path = require("path");

gulp.task("createMergedGLSLChunkFile_ts", function (done) {
    var chunkConverter = require("chunk_converter");

    var chunkFilePath = path.join(process.cwd(), "src/glsl/MergedGLSLChunk.ts");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    chunkConverter.createMergedGLSLChunkFileForTs(glslPathArray, chunkFilePath, done);
});

gulp.task("createMergedGLSLChunkFile_res", function (done) {
    var chunkConverter = require("chunk_converter");

    var chunkFilePath = path.join(process.cwd(), "src/glsl/MergedGLSLChunk.res");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    chunkConverter.createMergedGLSLChunkFileForRes(glslPathArray, chunkFilePath, done);
});