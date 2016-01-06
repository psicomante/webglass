/**
 * Webglass Utilities Functions
 */
export module Tools {

  /**
   * A default fragment, that shows a changing coloured background
   * based on the interpolated vertex position
   * @type {[type]}
   */
  export const defaultVertexSrc = `
  precision highp float;

  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform vec2 u_resolution;
  uniform float u_time;

  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
  `;

  export const defaultFragmentSrc = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;

  varying vec2 v_texCoord;

  void main(void) {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(uv,0.5+0.5*sin(u_time),1.0);
  }
  `;

  export const defaultErrorFragmentSrc = `
  void main(){
    gl_FragColor = vec4(1.0,0.0,1.0,1.0);
  }
  `;

  /**
   * Default ajax request for loading shaders
   *
   * @param  {String} url     the resource to call
   * @return {String}         the content of the requested resource
   */
  export function http(url: string) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
      return request.responseText;
    }
  }

  export var assign = Object.assign;

}
