/**
 * This is WebGlass,
 * a WebGL library i made in order to learn WebGL, Shaders and in general, Computer Graphics.
 */

// import {WebGLCanvas} from './core';
import {WebGLU} from './webgl';
import {Tools} from './tools';

interface WebglassSettings {
  managed: boolean;
  stoppable: boolean;
  responsive?: boolean;
  fragmentSrc?: string;
}

const defaultSettings:WebglassSettings = {
  managed: true,
  stoppable: false,
  responsive: false,
  fragmentSrc: Tools.defaultFragmentSrc
}


export class WebGlass {

  /**
   * Debug Activation Flag
   * @type {boolean}
   */
  private debug: boolean;

  /**
   * [canvas description]
   * @type {HTMLCanvasElement}
   */
  private canvas: HTMLCanvasElement;

  /**
   * The WebGL rendering context, if any
   * @type {WebGLRenderingContext}
   */
  private gl: WebGLRenderingContext;

  /**
   * [program description]
   * @type {WebGLProgram}
   */
  private program: WebGLProgram;

  /**
   * GLSL Source code of fragment shader
   */
  private fragmentSource: string;

  /**
   * If the the webglass is animated, then we call render function
   * at each requestAnimationFrame
   * @type {boolean}
   */
  private animated: boolean;

  /**
   * If the fragment shader is valid or not
   * @type {boolean}
   */
  private valid: boolean;

  private playing: boolean;

  private animationFrame: any;

  private vbo: Array<Float32Array>;

  private settings: WebglassSettings;
  private startTime:any;
  /**
   * Webglass constructor
   * @param  {string}  id    [description]
   * @param  {boolean} debug [description]
   * @return {[type]}        [description]
   */
  constructor(canvas: HTMLCanvasElement, debug: boolean, settings:WebglassSettings) {
    var self = this;

    this.vbo = [];

    // default fragment source
    this.fragmentSource = defaultSettings.fragmentSrc;

    // assign settings
    this.settings = settings;
    if (!settings) {
      this.settings = defaultSettings;
    }

    // create canvas
    this.canvas = canvas;

    // if (id != null) {
    //   this.canvas = <HTMLCanvasElement>document.getElementById(id);
    //   console.log("canvas: ", this.canvas);
    // } else {
    //   // @todo
    // }

    this.gl = this.initWebGL();

    // load shaders
    if (this.canvas.hasAttribute('data-fragment-url')) {
      let sourceUrl = this.canvas.getAttribute('data-fragment-url');
      this.fragmentSource = Tools.http(sourceUrl);
    }
    if (this.canvas.hasAttribute('data-fragment')) {
      this.fragmentSource = this.canvas.getAttribute('data-fragment');
    }
    this.program = this.load(this.fragmentSource, Tools.defaultVertexSrc);

    if (this.program) {
      // Define Vertex buffer
      let vertices;
      // look up where the vertex data needs to go.
      var vertexPositionAttribute = this.gl.getAttribLocation(this.program, 'a_position');
      // Create a buffer and put a single clipspace rectangle in
      // it (2 triangles)
      vertices = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertices);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(
        [-1.0, -1.0,
          1.0, -1.0,
          -1.0, 1.0,
          -1.0, 1.0,
          1.0, -1.0,
          1.0, 1.0]), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(vertexPositionAttribute);
      this.gl.vertexAttribPointer(vertexPositionAttribute, 2, this.gl.FLOAT, false, 0, 0);
      this.vbo.push(vertices);
    }

    // Start RenderLoop or calls only a Draw
    if (this.settings.managed) {
      this.start();
    } else {
      this.render(true);
    }

    // Stop/Restart Animation
    if (this.settings.stoppable) {
      self.canvas.addEventListener('click', function() {
        if (self.isPlaying()) {
          self.stop();
        } else {
          self.start();
        }
      });
    }

    // Resizable Canvas
    if (this.settings.responsive) {
      self.setResponsive();
      window.addEventListener('resize', function() {
        self.setResponsive();
      });
    }

    // redefine console
    // var old = console.log;
    // console.log = function(){
    //   if (debug) return;
    //   Array.prototype.unshift.call(arguments, 'Report: ');
    //   old.apply(this, arguments)
    // }


  }

  initWebGL() {
    if (!WebGLRenderingContext) {
      console.error("WebGL is not available");
      return null;
    }
    // create a webgl rendering
    var gl = WebGLU.create3DContext(this.canvas);

    if (!gl) {
      console.error("WebGL is not initialized");
      return null;
    }

    gl.getExtension('OES_standard_derivatives');
    return gl;
  }

  alternateWebGLContent() {

  }

  /**
   * Setup fragment and vertex shaders
   * @param  GLSL fragment shader source
   * @param  {String} vertexSrc   [description]
   * @return {[type]}             [description]
   */
  load(fragmentSrc:string, vertexSrc:string) {

    // find if fragment shader uses time or mouse
    let nTimes = (fragmentSrc.match(/u_time/g) || []).length;
    let nMouse = (fragmentSrc.match(/u_mouse/g) || []).length;
    this.animated = nTimes > 1 || nMouse > 1;

    // creates the WebGLShader objects
    let fragmentShader = WebGLU.createWebGLShader(this.gl, fragmentSrc, this.gl.FRAGMENT_SHADER);
    let vertexShader = WebGLU.createWebGLShader(this.gl, vertexSrc, this.gl.VERTEX_SHADER);

    // If Fragment shader fails load a empty one to sign the error
    if (!fragmentShader) {
      fragmentShader = WebGLU.createWebGLShader(this.gl, Tools.defaultErrorFragmentSrc, this.gl.FRAGMENT_SHADER);
      this.valid = false;
    } else {
      this.valid = true;
    }

    // Create and use program
    let program = WebGLU.createProgram(this.gl, [vertexShader, fragmentShader]);
    // Uses the specified WebGLProgram as part the current rendering state.
    this.gl.useProgram(program);

    // deleteshaders
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    return program;
  };

  setMouse(mouse) {
    // set the mouse uniform
    let rect = this.canvas.getBoundingClientRect();
    if (mouse && mouse.x && mouse.y &&
    mouse.x >= rect.left &&
    mouse.x <= rect.right &&
    mouse.y >= rect.top &&
    mouse.y <= rect.bottom) {

      this.setUniform('u_mouse', [mouse.x - rect.left, this.canvas.height - (mouse.y - rect.top)]);
    }
  };

  setUniform(name, value) {
    let location = this.gl.getUniformLocation(this.program, name);
    if (typeof value === 'number') {
      // console.log('1f ' + name + ' ' + value);
      this.gl.uniform1f(location, value);
    } else if (typeof value === 'string') {
      // if (this.textures[name] === undefined) {
      //   this.loadTexture(name, value);
      // } else {
      //   this.gl.uniform1i(this.gl.getUniformLocation(this.program, name),
      //   this.texureIndex);
      //
      //   this.gl.activeTexture(this.gl.TEXTURE0 + this.texureIndex);
      //   this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[name]);
      //
      //   this.setUniform(name + 'Resolution', [this.textures[name].image.width,
      //   this.textures[name].image.height]);
      //
      //   this.texureIndex++;
      // }
    } else if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          // console.log('1f ' + name + ' ' + value[0]);
          this.gl.uniform1f(location, value[0]);
          break;
        case 2:
          // console.log('2f ' + name + ' ' + value[0] + ', ' + value[1]);
          this.gl.uniform2f(location, value[0], value[1]);
          break;
        case 3:
          // console.log('3f ' + name + ' ' + value[0] + ', ' + value[1] + ', ' + value[2]);
          this.gl.uniform3f(location, value[0], value[1], value[2]);
          break;
        case 4:
          // console.log('4f ' + name + ' ' + value[0] + ', ' + value[1] + ', ' + value[2] + ', ' + value[3]);
          this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
          break;
        default:
          return;
      }
    } else if (typeof value === 'object') {
      for (let prop in value) {
        this.setUniform(name + '.' + prop, value.prop);
      }
    }
  };

  loop() {
    if (this.playing) {
      this.render(false);
      this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  stop() {
    this.playing = false;
    cancelAnimationFrame(this.animationFrame);
  }

  start() {
    this.playing = true;
    this.startTime = Date.now();
    this.loop();
  }

  setResponsive() {
    var realToCSSPixels = window.devicePixelRatio || 1;
    var canvas = this.canvas;
    var gl = this.gl;

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.
    var displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
    var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

    // Check if the canvas is not the same size.
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    // let's force-render if the canvas is not in RenderLoop
    // we need to refresh the viewport
    if (!this.settings.managed) {
      this.render(true);
    }
  }

  isValid() {
    return this.valid;
  }

  isManaged() {
    return this.settings.managed;
  }

  isPlaying() {
    return this.playing;
  }

  render(forceRender: boolean) {
    if (forceRender || this.shouldRender()) {
      // set the time uniform
      let timeFrame = Date.now();
      let time = (timeFrame - this.startTime) / 1000.0;
      this.setUniform('u_time', time);

      // set the resolution uniform
      this.setUniform('u_resolution', [this.canvas.width, this.canvas.height]);

      // this.texureIndex = 0;
      // for (let tex in this.textures) {
      //   this.setUniform(tex, this.textures[tex].url);
      // }

      // Draw the rectangle.
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
  };

  shouldRender() {
    return this.animated && this.isCanvasVisible();
  }

  /**
   * Checks if the current canvas is visible on the browser or hidden down the page
   */
  isCanvasVisible() {
    return	(this.canvas.getBoundingClientRect().top + this.canvas.height) > 0 &&
    (this.canvas.getBoundingClientRect().top < (window.innerHeight || document.documentElement.clientHeight));
  }

  static version() {
    return '0.3.0';
  };
}

/**
 * WebGlassTornado is a class that allows to activate a webglass on every canvas on the page
 *
 *
 */
export class WebglassTornado {

  private static CANVAS_ATTRIBUTES: Array<string> = ['managed', 'responsive'];

  /**
   * List of webglass instance, one for each canvas
   * @type {Array<HTMLCanvasElement>}
   */
  private webglassList: Array<WebGlass>;

  constructor() {
    // webglass object list
    this.webglassList = [];

    // this.options = wgu.extend(TORNADO_DEFAULTS, options);

    // .nfo!
    // @see https://en.wikipedia.org/wiki/.nfo
    // if (this.options.nfo) {
    //   wgu.nfo();
    // }

    var canvasList = <NodeListOf<HTMLCanvasElement>>document.getElementsByTagName('canvas');
    // Load shaders on canvas
    for (let i = 0; i < canvasList.length; i++) {
      let canvas = canvasList[i];
      let canvasOptions = this.getAttributes(canvas);
      let wgl = new WebGlass(canvas, true, defaultSettings);
      if (wgl.isValid) {
        this.webglassList.push(wgl);
      }
    }
  }

  getAttributes(canvas) {
    var attributes = {};

    for (let i = 0; i < WebglassTornado.CANVAS_ATTRIBUTES.length; i++) {
      var attribute = canvas.getAttribute(WebglassTornado.CANVAS_ATTRIBUTES[i]);

      if (attribute) {
        attributes[WebglassTornado.CANVAS_ATTRIBUTES[i]] = attribute;
      }
    }

    return attributes;
  }
}

// let wgl:WebGlass = new WebGlass(<HTMLCanvasElement>document.getElementById('test'), true, defaultSettings);
// let tornado:WebGlassTornado = new WebGlassTornado();
