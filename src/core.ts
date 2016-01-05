export class Canvas {
  public HTMLCanvasElement;

  constructor(id: string) {
    this.HTMLCanvasElement = document.getElementById(id);
    console.log(this.HTMLCanvasElement);
  }
}

export class WebGLCanvas extends Canvas {
  private WebGLContext;

  constructor(id: string) {
    super(id);

    this.WebGLContext = this.HTMLCanvasElement.getContext("webgl");
    console.log(this.WebGLContext);
  }
}
