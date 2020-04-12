/**
	Arrowhead Co. - WebGL Shorthand Utility Functions v1.0
	
	>>> Makes it easier to deal with WebGL shaders.
	>>> Handles WebGL programs as well.
	>>> Handles buffers and textures.
**/

	/*SHADER*/

var SHADER = (function(){

	//In case gl has not been defined
	//
	if(!gl){
		console.error("ERROR: gl has not been defined.");

		return;
	}

	//Shader object
	//
	SHADER = {};

	//Vertex shader constructor
	//
	SHADER.vertex = function(source){
		this.id = "vertex";

		//If source is text version of shader
		//
		if(source.includes("void main")){
			this.source = source;
		} else {
			
			//Source refers to id of shader element
			//
			let s = document.getElementById(source);
				s = s.innerHTML;
				s = s.toString();

			//Not found
			//
			if(!s){
				console.error("ERROR: Shader not found at SHADER.vertex().");

				return false;
			}

			this.source = s;

		}

		this.shader = gl.createShader(gl.VERTEX_SHADER);
					  gl.shaderSource(this.shader, this.source);

		return this;
	};

	//Fragment shader constructor
	//
	SHADER.fragment = function(source){
		this.id = "fragment";

		//If source is text version of shader
		//
		if(source.includes("void main")){
			this.source = source;
		} else {
			
			//Source refers to id of shader element
			//
			let s = document.getElementById(source);
				s = s.innerHTML;
				s = s.toString();

			//Not found
			//
			if(!s){
				console.error("ERROR: Shader not found at SHADER.fragment().");

				return false;
			}

			this.source = s;

		}

		this.shader = gl.createShader(gl.FRAGMENT_SHADER);
					  gl.shaderSource(this.shader, this.source);

		return this;
	};

	//Compiler
	//
	SHADER.compile = function(shader){
		
		//In case forgot to specify
		//
		if(!this.shader){
			console.error("ERROR: No shader specified at SHADER.compile().");

			return false;
		}

		//Gets shader property of shader
		//
		gl.compileShader(this.shader);

		//Compilation errors
		//
		if(!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)){
			
			console.error("ERROR: could not compile shader.", 
				gl.getShaderInfoLog(this.shader));

			return false;
		}

		return this;
	};

	//Bindings to shader prototypes
	//
	SHADER.vertex.prototype.compile   = SHADER.compile;
	SHADER.fragment.prototype.compile = SHADER.compile;

	return SHADER;
})();

	/*PROGRAM*/

var PROGRAM = (function(){
	
	//In case gl has not been defined
	//
	if(!gl){
		console.error("ERROR: gl has not been defined.");

		return;
	}

	//Program object
	//
	PROGRAM = {};

	//New program constructor
	//
	PROGRAM.new = function(){
		this.id = "program";

		//If arguments are lacking
		//
		if(arguments.length < 2){
			console.error("ERROR: Missing a shader as input at PROGRAM.new().");

			return false;
		}

		let hasVert = false,
			hasFrag = false;

		this.program = gl.createProgram();

		//Attaches shaders to program and checks for warnings
		//
		for(let i in arguments){
			gl.attachShader(this.program, arguments[i].shader);

			if(!hasVert && arguments[i].id === "vertex"){
				hasVert = true;
			}

			if(!hasFrag && arguments[i].id === "fragment"){
				hasFrag = true;
			}
		}

		//In case user forgets
		//
		if(!hasVert){
			console.warn("WARNING: No vertex shader given at PROGRAM.new().");
		}

		if(!hasFrag){
			console.warn("WARNING: No fragment shader given at PROGRAM.new().");
		}

		return this;
	};

	//Linker
	//
	PROGRAM.link = function(){
		gl.linkProgram(this.program);

		//In case link is unsuccesful
		//
		if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
			console.error("ERROR: Unsuccesful program linking.",
				gl.getProgramInfoLog(this.program));

			return false;
		}

		return this;
	};

	//User
	//
	PROGRAM.use = function(){

		//Uses this program
		//
		gl.useProgram(this.program);

		return this;
	};

	//Handle for shader properties
	//
	PROGRAM.newHandle = function(type, identifier){
		let location;

		//User forgot input
		//
		if(!identifier){
			console.error("ERROR: Missing argument at PROGRAM.newHandle().");

			return false;
		}

		//Identifies location based on type
		//
		switch(type){
			
			//Handles attributes
			//
			case "attribute":
				location = gl.getAttribLocation(this.program, identifier);
			break;

			//Handles uniforms
			//
			case "uniform":
				location = gl.getUniformLocation(this.program, identifier);
			break;

			default:
				console.error("ERROR: type is not a defined type.");

				return false;
			break;
		}

		return location;
	};

	PROGRAM.useHandle = function(type, location, elementsPer, vertexSize, offsetTo, input){
		
		//User forgot input
		//
		if(!location && location !== 0){
			console.error("ERROR: Missing argument at PROGRAM.useHandle().");

			return false;
		}

		//Defaults
		//
		offsetTo = 	  offsetTo 	  || 0;
		vertexSize =  vertexSize  || 1;
		elementsPer = elementsPer || 1;

		//Identifies location based on type
		//
		switch(type){
			
			//Handles attributes
			//
			case "attribute":
				gl.vertexAttribPointer(
			   		 location, elementsPer, gl.FLOAT, gl.FALSE,
			   				   vertexSize * Float32Array.BYTES_PER_ELEMENT,
			   	 			   offsetTo   * Float32Array.BYTES_PER_ELEMENT);
			    gl.enableVertexAttribArray(location);
			break;

			//Handles uniforms
			//
			case "uniform":
				switch(input.id){
					case "matrix4x4":

						//Default of matrix 4x4
						//
						gl.uniformMatrix4fv(location, gl.FALSE, input.value);
					break;
				}
			break;

			default:
				console.error("ERROR: type is not a defined type.");

				return false;
			break;
		}

		return this;
	};

	//Bindings
	//
	PROGRAM.new.prototype.link   	= PROGRAM.link;
	PROGRAM.new.prototype.use    	= PROGRAM.use;
	PROGRAM.new.prototype.useHandle = PROGRAM.useHandle;
	PROGRAM.new.prototype.newHandle = PROGRAM.newHandle;

	return PROGRAM;
})();

	/*BUFFER*/

var BUFFER = (function(){

	//In case gl has not been defined
	//
	if(!gl){
		console.error("ERROR: gl has not been defined.");

		return;
	}

	//Buffer object
	//
	BUFFER = {};

	BUFFER.new = function(buffer, type){
		this.id = "buffer";

		//Just in case
		//
		if(!buffer){
			console.error("ERROR: No buffer specified at BUFFER.new().");

			return false;
		}

		this.buffer = gl.createBuffer();

		this.type = type;

		//Defines and binds buffer based on type
		//
		if(type === "array" || !type){

			//Vertices
			//
			buffer = new Float32Array(buffer);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, 		buffer, gl.STATIC_DRAW);
		} else if(type === "elements" || type !== "array"){

			//Indices
			//
			buffer = new Uint16Array(buffer);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 		buffer, gl.STATIC_DRAW);
		}

		return this;
	};

	BUFFER.unbind = function(){

		//Unbinds buffers
		//
		if(this.type === "array" || 
		  !this.type){
			
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		} else if(this.type === "elements" || 
				  this.type !== "array"){
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}

		return this;
	};

	//Bindings
	//	
	BUFFER.new.prototype.unbind = BUFFER.unbind;

	return BUFFER;
})();

	/*TEXTURE*/

var TEXTURE = (function(){

	//In case gl has not been defined
	//
	if(!gl){
		console.error("ERROR: gl has not been defined.");

		return;
	}

	//Texture object
	//
	TEXTURE = {};

	TEXTURE.sample = function(texture, width, height){

		//In case
		//
		if(!width || !height){
			console.error("ERROR: Invalid dimensions provided at TEXTURE.sample().");

			return false;
		}

		//Binds texture and sets parameters
		//
		this.texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
										gl.RGBA, gl.UNSIGNED_BYTE, texture);

		return this;
	};

	TEXTURE.unbind = function(){

		//Unbinds texture
		//
		gl.bindTexture(gl.TEXTURE_2D, null);

		return this;
	};

	//Bindings
	//
	TEXTURE.sample.prototype.unbind = TEXTURE.unbind;

	return TEXTURE;
})();