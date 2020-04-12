/**
	Arrowhead Co. - WebGL Camera v1.0

	>>> Helps in first-person viewing.
	>>> Currently cannot be made orthographic.
**/

	/*CAMERA*/

var CAMERA = (function(){

	//The camera
	//
	CAMERA = function(fov, min, max){

		//Position, looking direction, up direction
		//
		this.pos = {
			x : 0,
			y : 0,
			z : -5,
		};

		this.look = {
			x : 0,
			y : 0,
			z : 1,
		};

		this.up = {
			x : 0,
			y : 1,
			z : 0,
		};

		//Field of view, near plane, far plane
		//
		this.fov  = fov || Math.PI / 4;
		this.zMin = min || 0.1;
		this.zMax = max || 1000;
	};

	//FPS
	//
	CAMERA.FollowFPS = function(object){

		//In case 
		//
		if(!object.looking){
			console.error("ERROR: Please give object a property 'looking'.");

			return false;
		}

		if(!object.pos){
			console.error("ERROR: Please give object a property 'pos'.");

			return false;
		}

		//Sets camera
		//
		this.pos.x = object.pos.x;
		this.pos.y = object.pos.y;
		this.pos.z = object.pos.z;

		this.look.x = object.pos.x + object.looking.x;
		this.look.y = object.pos.y + object.looking.y;
		this.look.z = object.pos.z + object.looking.z;

		if(object.fov){
			this.fov = object.fov;
		}

		return this;
	};

	//TPS
	//
	CAMERA.FollowTPS = function(object, dist){

		//In case 
		//
		if(!object.looking){
			console.error("ERROR: Please give object a property 'looking'.");

			return false;
		}

		if(!object.pos){
			console.error("ERROR: Please give object a property 'pos'.");

			return false;
		}

		let magnitude = Math.hypot(object.looking.x,
								   object.looking.y,
								   object.looking.z);

		dist = dist || 2.5;

		//Sets camera
		//
		this.pos.x = object.pos.x - object.looking.x / magnitude * dist;
		this.pos.y = object.pos.y - object.looking.y / magnitude * dist;
		this.pos.z = object.pos.z - object.looking.z / magnitude * dist;

		this.look.x = object.pos.x;
		this.look.y = object.pos.y;
		this.look.z = object.pos.z;

		return this;
	};

	//Bindings
	//
	CAMERA.prototype.FollowFPS = CAMERA.FollowFPS;
	CAMERA.prototype.FollowTPS = CAMERA.FollowTPS;

	return CAMERA;
})();