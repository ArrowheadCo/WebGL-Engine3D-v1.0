/**
	Arrowhead Co. - WebGL Input / Output Stream v1.0

	>>> Handles input and output for WebGL 3D Engine.
**/

	/*GLOBALS*/

var keys = {};

var mouse = {
	x : 0,
	y : 0,

	//Distance change
	//
	dx : 0,
	dy : 0,

	pressed :   false,
	released :  false,
	isPressed : false,

	leftIsPressed  : false,
	rightIsPressed : false,

	//Should be called in loop (last-most)
	//
	reset : function(){

		//Resets mouse details
		//
		this.dx = 0;
		this.dy = 0;

		this.pressed =  false;
		this.released = false;

		return true;
	}
};

var pointerLock = 
    document.body.requestPointerLock ||
    document.body.mozRequestPointerLock;

var exitPointerLock = 
    document.body.exitPointerLock ||
    document.body.mozExitPointerLock;

	/*MOUSE UTILITY FUNCTIONS*/

function isLocked(){
    
	//Attaches and detaches mouse mover
	// 
    if(document.pointerLockElement !== null){
       document.addEventListener("mousemove", mouseMove);
    } else {
       document.removeEventListener("mousemove", mouseMove);
    }
};

function mouseMove(input){
	
	//Distance change
	//
	mouse.dx = input.movementX;
	mouse.dy = input.movementY;
};

function mousePress(input){

	//Handles mouse pressing
	//
	mouse.pressed =   true;
	mouse.isPressed = true;

	if(input.button == 0){
		mouse.button = "left";

		mouse.leftIsPressed = true;
	} else {
		mouse.button = "right";

		mouse.rightIsPressed = true;
	}
};

function mouseRelease(input){

	//Handles mouse releasing
	//
	mouse.released =  true;
	mouse.isPressed = false;
	mouse.button =    undefined;

	if(input.button === 0){
		mouse.leftIsPressed = false;
	} else {
		mouse.rightIsPressed = false;
	}
};

	/*KEY UTILITY FUNCTIONS*/

function keyPress(input){
	let key = input.code;

	//Better key handling
	//
	if(key.includes("Key")){
		key = key.slice(3);
	}

	if(key.includes("Arrow")){
		key = key.slice(5);
	}

	keys[key.toUpperCase()] = true;
};

function keyRelease(input){
	let key = input.code;

	//Better key handling
	//
	if(key.includes("Key")){
		key = key.slice(3);
	}

	if(key.includes("Arrow")){
		key = key.slice(5);
	}

	keys[key.toUpperCase()] = false;
};

//Suggestion by Daniel (Thanks!)
//
document.body.addEventListener('keydown', function(event) {

    // Prevents the default action AKA scrolling
    //
    event.preventDefault();
});

	/*BINDINGS*/

//Mouse functions
//
document.addEventListener("mousedown", mousePress);
document.addEventListener("mouseup", mouseRelease);

document.getElementsByTagName("canvas")[0].onclick = pointerLock;
document.addEventListener("pointerlockchange", isLocked);
document.addEventListener("mozpointerlockchange", isLocked);

//Key functions
//
document.addEventListener("keydown", keyPress);
document.addEventListener("keyup", keyRelease);