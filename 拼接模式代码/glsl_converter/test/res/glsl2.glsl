@define
define B 2;
@end



@varDeclare
varying vec2 v_mapCoord2;
@end

@funcDeclare
vec3 func2(vec3 lightPos);
@end

@funcDefine
vec3 func2(vec3 lightPos){
    return vec3(0.5);
}
@end

@body
gl_FragColor = vec4(1.0,0.5,1.0,1.0);
@end