/**
 * a generic webgl utility module used in WebGlass;
 *
 *
 * Thx to (for inspiration, code and lessons learned)
 * - Gregg Tavares - @greggman
 *   webgl-utils.js <https://github.com/greggman/webgl-fundamentals/blob/master/webgl/resources/webgl-utils.js>
 */
export module WebGLU {

  function logError(msg) {
    console.error('[WEBGLASS] ', msg);
  }

  /**
   * Creates a WebGL context.
   * @param  {HTMLCanvasElement} canvas The canvas tag to get context from.
   *                                    If one is not passed in one will be created.
   * @param  {WebGLContextCreationAttributes} opt_attribs Any creation attributes you want to pass in.
   * @return {WebGLRenderingContext} The created context.
   */
  export function create3DContext(canvas: HTMLCanvasElement, opt_attribs?) {
    var names = ['webgl', 'experimental-webgl'];
    var context = null;

    for (let i = 0, l = names.length; i < l; i++) {
      try {
        context = canvas.getContext(names[i], opt_attribs);
      } catch (e) {} // eslint-disable-line
      if (context) {
        break;
      }
    }
    return context;
  }

  /**
   * Create a shader with a source.
   * @param {WebGLRenderingContext} gl
   * @param {string} source shader source
   * @param {string} type shader type [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER]
   * @return {WebGLShader} the created shader
   */
  export function createWebGLShader(gl:WebGLRenderingContext, source:string, type:number):WebGLShader {
    // Creates a WebGLProgram.
    let shader = gl.createShader(type);
    // Sets the source code in a WebGLShader.
    gl.shaderSource(shader, source);
    // Compiles a WebGLShader.
    gl.compileShader(shader);

    // check the compile status
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // Returns the information log for a WebGLShader object.
      let infoLog = gl.getShaderInfoLog(shader);
      console.error('*** Error compiling shader ' + shader + ':' + infoLog);
      // Deletes a WebGLShader.
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
    * Creates a program, attaches shaders, binds attrib locations, links the
    * program and calls useProgram.
    *
    * @param shaders The shaders to attach
    * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
    * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
    * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
    *        on error. If you want something else pass an callback. It's passed an error message.
    * @memberOf module:webgl-utils
    */
  /**
   * [createProgram description]
   * @param  {WebGLRenderingContext} gl                the WebGLRenderingContext
   * @param  {Array<WebGLShader>}    shaders           [description]
   * @param  {[type]}                opt_attribs       [description]
   * @param  {[type]}                opt_locations     [description]
   * @param  {[type]}                opt_errorCallback [description]
   * @return {[type]}                                  [description]
   */
  export function createProgram(gl:WebGLRenderingContext, shaders:Array<WebGLShader>, opt_attribs?, opt_locations?, opt_errorCallback?) {
    // set the error callback to call
    let errFn = opt_errorCallback || logError;
    let program = gl.createProgram();

    shaders.forEach(function(shader) {
      gl.attachShader(program, shader);
    });

    if (opt_attribs) {
      opt_attribs.forEach(function(attrib, ndx) {
        gl.bindAttribLocation(
          program,
          opt_locations ? opt_locations[ndx] : ndx,
          attrib);
      });
    }
    gl.linkProgram(program);

    // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // something went wrong with the link
      var lastError = gl.getProgramInfoLog(program);
      errFn('Error in program linking:' + lastError);

      gl.deleteProgram(program);
      return null;
    }
    return program;
  }
}
