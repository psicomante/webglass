precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec3 check(vec2 p, float s)
{
  return vec3(floor(mod(p.x+p.y,2.0)));
}


void main()
{
	// aspect ratio
	float ar = u_resolution.x / u_resolution.y;
  // center coordinates
  vec2 uv = gl_FragCoord.xy / u_resolution.y - vec2(0.5*ar, 0.5);
	// reduction factor
	float r = sqrt(dot(uv,uv));

	vec2 p = vec2(1. / r + u_time*0.1, atan(uv.y, uv.x) / 3.1416 + u_time * 0.2);
	//vec2 p = vec2(0.1 / r + u_time, sin(uv.y)*r);
	// vec3 col = texture2D(iChannel0, uv).xyz * (1.0 - (0.02 / length(p)));
	gl_FragColor = vec4(check(p, 0.5)*log(r*10.), 1.0);
}
