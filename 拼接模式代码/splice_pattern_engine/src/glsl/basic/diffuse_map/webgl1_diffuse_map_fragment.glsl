@varDeclare
varying vec2 v_diffuseMapCoord0;
@end

@body
    vec4 texelColor = texture2D(u_diffuseMapSampler, v_diffuseMapCoord0);

    vec4 totalColor = vec4(texelColor.rgb * u_color, texelColor.a);
@end

