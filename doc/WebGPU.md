# 问
老模式：
先遍历mesh---》根据mesh类型判断顶点---》确定顶点的layout----》不同的pipeline

材质---》根据材质类型判断---》WGSL很多if，else\或者根据类型选不同的shader----》不同的片元着色器

# 答

是的，对于WebGPU而言，跟WebGL不同的是有pipeline

所以即使用老模式，也没有性能问题

因为在初始化时创建对应Shader的pipeline，然后在渲染时绑定对应的pipeline即可

而WebGL是在渲染时进行分支判断，得到Send Config，这一步有点性能问题

但是WebGPU用老模式的话，还是使用一个大的if else宏的Shader，用户不能自由组合Shader

所以WebGPU还是可以用拼接模式