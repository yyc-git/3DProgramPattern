var gulp = require("gulp");
var path = require("path");

gulp.task("createShaderChunkFile_ts", function (done) {
    var compiler = require("glsl_converter");

    var shaderChunkFilePath = path.join(process.cwd(), "src/glsl/ShaderChunk.ts");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    compiler.createChunkFileForTs(glslPathArray, shaderChunkFilePath, done);
});

gulp.task("createShaderChunkFile_res", function (done) {
    var compiler = require("glsl_converter");

    var shaderChunkFilePath = path.join(process.cwd(), "src/glsl/ShaderChunk.res");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    compiler.createChunkFileForRes(glslPathArray, shaderChunkFilePath, done);
});