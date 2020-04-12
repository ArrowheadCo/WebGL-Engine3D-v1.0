/**
	Arrowhead Co. - WebGL Context Setting v1.0

	>>> Readily sets WebGLRenderingContext.
	>>> Provides some utility functions for basic tasks.
**/

	/*GLOBALS*/

var 

canvas,				//Canvas element
gl,					//Rendering context

width,				//Canvas width
height, 			//Canvas height

RESOLUTION = 0.5;	//Resolution 0-1 (1 - best)

	/*SETUP*/

function setup(){
	canvas = document.getElementsByTagName("canvas")[0];

	//User forgot to create canvas
	//
	if(!canvas){
		console.error("ERROR: No canvas found.");

		return false;
	}

	//Sets webgl rendering context; fallback when necessary
	//
	gl = canvas.getContext("webgl", {antialias : false});

	if(!gl){
		console.warn("WARNING: falling back on experimental webgl.");

		gl = canvas.getContext("experimental-webgl", {antialias : false});
	}

	//A bad non-compliant browser is being used
	//
	if(!gl){
		console.error("ERROR: WebGL not supported by browser.");

		return false;
	}

	//Canvas resizing and buffer resetting
	//
	resize();
	clear();

	return true;
}

	/*FONTS*/

//Fonts
//
function fontDefine(){
	let fontString = "";

	//For each font
	//
	for(let i = 0; i < arguments.length; i++){
		let font = 	   arguments[i].split(" ");

		for(let j = 0; j < font.length; j++){
			fontString += font[j];

			if(j !== font.length - 1){
				fontString += "+";
			}
		}

		if(i !== arguments.length - 1){
			fontString += "|";
		}
	}

	let fonts = document.getElementById("fonts");

	//Append link to head element
	//
	if(fonts){
		fonts.parentNode.removeChild(fonts);
	} else {
		let link = document.createElement("link");

		//Generate link
		//
		link.id =   "fonts";
		link.rel =  "stylesheet";			
		link.type = "text/css";
		link.href = "https://fonts.googleapis.com/css?family=" + 
			fontString;

		document.getElementsByTagName("head")[0]
				.appendChild(link);
	}

	return true;
}

	/*BUFFER CLEARING*/

function clear(buffer, color){
	
	//Sets default clear color (black)
	//
	if(!color){
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	} else {

		//User-specified color is of wrong format
		//
		if(color.length !== 4){

			console.error("ERROR: Incorrect color specification at clear().");

			return false;
		}

		gl.clearColor(color[0],
					  color[1],
					  color[2],
					  color[3]);
	}

	//Clears both buffers by default
	//
	if(!buffer){
		gl.clear(gl.COLOR_BUFFER_BIT | 
				 gl.DEPTH_BUFFER_BIT);
	} else {

		//Clears buffers individually if specified
		//
		if(buffer === "color"){
			gl.clear(gl.COLOR_BUFFER_BIT);
		}

		if(buffer === "depth"){
			gl.clear(gl.DEPTH_BUFFER_BIT);
		}

		//Just in case
		//
		if(buffer !== "color" || 
		   buffer !== "depth"){

			console.error("ERROR: Incorrect buffer specification at clear().");

			return false;
		}
	}

	return true;
};

	/*WINDOW RESIZING*/

function resize(){

	//Canvas size based on viewport
	//
	canvas.width =  window.innerWidth * RESOLUTION;
	canvas.height = window.innerHeight * RESOLUTION;

	width =  window.innerWidth * RESOLUTION;
	height = window.innerHeight * RESOLUTION;

	//Configure webgl to canvas
	//
	gl.viewport(0, 0, width, height);
};

	/*BINDING*/

setup();
window.onresize = resize;