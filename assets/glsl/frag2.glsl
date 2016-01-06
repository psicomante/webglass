precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 check(vec2 p, float s)
{
	return vec3(floor(mod(p.x/s+p.y/s,2.0)));
}

void main (void) {

	// aspect ratio
	float ar = u_resolution.x / u_resolution.y;
	// center coordinates
	vec2 p = gl_FragCoord.xy / u_resolution.y - vec2(0.5*ar, 0.5);
	p.x *=3.;
	p.y *= 4.;
	//vec2 p = 2.0*(gl_FragCoord.xy/u_resolution.xy);
	//p.x *=  1.6;
	vec3 col = vec3(1.0);

	float y = p.y + cos(p.x);// + sin(p.x*25.)*0.05;
	vec2 uv;
	uv.x = p.x/y;
	uv.y = 1.0/abs(y)+u_time/5.0;
	col = check(uv, 0.50);
	float t = dot(abs(y),abs(y));

	gl_FragColor = vec4(col*t, 1.0 );

}
