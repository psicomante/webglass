/**
 * Fast changing default shader
 */

precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

void main(void)
{
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  gl_FragColor = vec4(0.5+0.5*sin(u_time),uv,1.0);
}
