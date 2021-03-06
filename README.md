# WebGlass

A tiny WebGL library for fragment shaders demo, written in TypeScript.

## Usage

Include the library

```html
<script src="webglass.js"></script>
<canvas id="canvas"></canvas>
```

Then call WebGlass on a single Canvas

```js
var wgl = new Webglass.Canvas('canvas', {debug:false});
```

or call Tornado for activating webglass on all Canvases in the page

```js
var wgl = new Webglass.Tornado();
```

### Canvas Data Attributes

* `data-fragment-url`: relative path to the fragment shader to load

## Contributing

### Install all the dependencies

```sh
// install rollup
npm install -g rollup

// install gulp
npm install -g gulp

// install npm dependencies
npm install

// run webglass build
gulp

// run webglass build and test server with watch features
gulp serve
```
