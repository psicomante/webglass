import {WebGLCanvas} from './core';

class Webglass extends WebGLCanvas {
  private debug:boolean;


  constructor(id: string, debug: boolean) {

    // redefine console
    var old = console.log;
    console.log = function(){
        if (debug) return;
        Array.prototype.unshift.call(arguments, 'Report: ');
        old.apply(this, arguments)
    }

    super(id);
  }
}

let wgl:Webglass = new Webglass('test', true);
