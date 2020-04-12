/**
	Arrowhead Co. - WebGL Texture Library v1.0

	>>> Has custom texture creator.
	>>>	Currently allows only custom-generated pixel maps for textures.
**/

	/*LIBRARY*/

var TEXTURES = {};

	/*CONSTRUCTORS*/

//Defines colors
//
function color(r, g, b, a){
	
	//Defaults
	r = r ? Math.min(Math.max(r, 0), 255) : r;
	g = g ? Math.min(Math.max(g, 0), 255) : g;
	b = b ? Math.min(Math.max(b, 0), 255) : b;
	a = a ? Math.min(Math.max(a, 0), 255) : a;

	//In case
	//
	if(!r && r !== 0){
		console.error("ERROR: Color takes in at least one parameter.");

		return false
	}

	//Difference input cases
	//
	if(!g && g !== 0){

		return [r, r, r, 255];
	}

	if(!b && b !== 0){

		return [r, r, r, g];
	}

	if(!a && a !== 0){

		return [r, g, b, 255];
	}

	return [r, g, b, a];
};

//Defines palettes
//
function palette(){
	
	let palette = {};

	for(let i = 0; i < arguments.length; i++){
		palette[i] = arguments[i];
	}

	return palette;
};

//Defines map
//
function map(){

	let map = {
		value : [],

		width  : 0,
		height : 0,
	};

	//Parses string into arrays
	//
	for(let i = 0; i < arguments.length; i++){
		let segment;

		segment = arguments[i].split(",");

		if(!map.width){
			map.width  = segment.length;
			map.height = arguments.length;
		}

		//Joins arrays
		//
		map.value = map.value.concat(segment);
	}

	return map;
};

	/*TEXTURE RENDERER*/

function texture(name, map, palette){

	let texture = {
		map : new Uint8ClampedArray(map.value.length * 4),

		width  : map.width,
		height : map.height,
	};

	for(let i = 0; i < map.value.length; i++){
		
		//In case map does not have value
		//
		if(!palette[+map.value[i]]){
			for(let j = 0; j < 4; j++){
				if(j === 3){
					texture.map[i * 4 + j] = 255;

					break;
				}

				texture.map[i * 4 + j] = 0;
			}

			continue;
		}

		//Appends colors
		//
		for(let j = 0; j < 4; j++){
			texture.map[i * 4 + j] = palette[+map.value[i]][j];
		}
	}

	//Saves it in library
	//
	TEXTURES[name] = texture;

	return texture;
};