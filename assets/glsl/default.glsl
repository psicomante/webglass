/**
 * Fast changing default shader
 */

 precision highp float;

 uniform vec2 u_resolution;
 uniform float u_time;

 varying vec2 v_texCoord;

 void main(void) {
   vec2 uv = gl_FragCoord.xy / u_resolution.xy;
   gl_FragColor = vec4(uv,0.5+0.5*sin(u_time),1.0);
 }
