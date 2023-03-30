@top
precision highp float;
@end

@define
#import "glsl2"
@end



@varDeclare

varying vec2 v_mapCoord0;

varying vec2 v_mapCoord1;
@end

@funcDeclare
vec3 func1(vec3 lightPos);
@end

@funcDefine
    #import "glsl2"
vec3 func1(vec3 lightPos){
    return vec3(1.0);
}
@end

@body
gl_Position = u_pMatrix * u_vMatrix * mMatrix * vec4(a_position, 1.0);
@end