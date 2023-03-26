var gulp = require("gulp");
var path = require("path");

gulp.task("createShaderChunkFile", function (done) {
    var compiler = require("glsl_compiler");

    var shaderChunkFilePath = path.join(process.cwd(), "src/glsl/ShaderChunk.ts");
    var glslPathArray = [path.join(process.cwd(), "src/glsl/**/*.glsl")];

    compiler.createChunkFile(glslPathArray, shaderChunkFilePath, done);
});