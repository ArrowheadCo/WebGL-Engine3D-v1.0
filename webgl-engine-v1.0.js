/**
	Arrowhead Co. - WebGL Rendering Engine v1.0

	>>> Handles the creation and manipulation of a scene.
	>>> Handles the rendering of multiple objects in a scene.
**/

	/*ENGINE*/

var GL_ENGINE = (function(){

	//The engine
	//
	GL_ENGINE = function(gl, vs, fs, bg){
		
		//GL object
		//
		this.gl = gl;

		//Shaders
		//
		this.vs = vs;
		this.fs = fs;

		//Background color (optional)
		//
		this.bg = [bg[0] || 0,
				   bg[1] || 0,
				   bg[2] || 0,
				   bg[3] || 1];

		//Objects to render
		//
		this.objects = [];

		//Methods for handling different object types
		//
		this.methods = {};

		return this;
	};

	GL_ENGINE.prototype = {

		//Creates a new method
		//
		method : function(method, func){
			this.methods[method] = func;
		},

		//Creates a new object and appends it
		//
		new : function(vertices, indices, texture,
				x,  y,  z,
				xl, yl, zl, id,
				vx, vy, vz,     
				ax, ay, az,
				mx, my, mz){

			let object = {
				
				//Location, size, orientation and other stuffs
				//
				x : x || 0,
				y : y || 0,
				z : z || 0,

				xl : xl || 0,
				yl : yl || 0,
				zl : zl || 0,

				vx : vx || 0,
				vy : vy || 0,
				vz : vz || 0,

				ax : ax || 0,
				ay : ay || 0,
				az : az || 0,

				mx : mx || 0,
				my : my || 0,
				mz : mz || 0,

				//Id of object
				//
				id : id || null,

				//When to remove object from list
				//
				kill : false,

				//Buffers
				//
				vBuffer : vertices,
				iBuffer : indices,

				//Texture
				//
				texture : texture,

				//Attributes and uniforms
				//
				attributes : {
					vertex : {
						size       : 3,
						totalBytes : 5,
						offset     : 0,
					},
					
					txCoor : {
						size       : 2,
						totalBytes : 5,
						offset     : 3,
					},
				},

				uniforms : {
					rot : {
						value : Matrix.identity(),
					},

					trans : {
						value : Matrix.identity(),
					},
				},
			}

			this.objects.push(object);
		},

		//Initializes scene
		//
		init : function(){

			//Defines program
			//
			this.vs = new SHADER.vertex  (this.vs);
			this.fs = new SHADER.fragment(this.fs);

			this.vs.compile();
			this.fs.compile();

			this.program = PROGRAM.new(this.vs, this.fs);
			this.program.link();
			this.program.use();

			//Retrieves locations
			//
			this.locations = {
				attributes : [
					"vertex",
					"txCoor",
				],

				uniforms : [
					"proj",
					"world",
					"trans",
					"rot",
				],
			};

			let locations = ["attributes", "uniforms"];

			for(let i = 0; i < locations.length; i++){

				let vars = {};
				
				for(let j = 0; j < this.locations[locations[i]].length; j++){

					vars[this.locations[locations[i]][j]] = this.program.newHandle(
						 	  locations[i].substr(0, locations[i].length - 1), 
						 this.locations[locations[i]][j]);
				}

				this.locations[locations[i]] = vars;
			}

			//Defaults
			//
			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.BACK);
			gl.frontFace(gl.CCW);
			
			gl.enable(gl.DEPTH_TEST);

			return this;
		},

		//Runs the entire scene
		//
		run : function(cam){

			//Computes world matrix
			//
			let world  = Matrix.lookAt(cam.pos, cam.look, cam.up);
			let proj   = Matrix.projection(cam.fov,  width / height,
										   cam.zMin, cam.zMax);

			//Buffers
			let vBuffer, vBufferReference;
			let iBuffer, iBufferReference;

			//Clears background
			//
			clear(0, this.bg);

			//Renders each object in scene
			//
			for(let i = 0; i < this.objects.length; i++){

				//Updates particular object type
				//
				if(this.objects[i].id){
					this.methods[this.objects[i].id].call(
								 this.objects[i]);
				}

				//Computes object matrices
				//
				this.objects[i].uniforms.rot.value = Matrix.rotate(
					this.objects[i].ax,
					this.objects[i].ay,
					this.objects[i].az);

				this.objects[i].uniforms.trans.value = Matrix.translate(
					this.objects[i].x,
					this.objects[i].y,
					this.objects[i].z);
				
				//Texture
				//
				TEXTURE.sample(this.objects[i].texture.map,
							   this.objects[i].texture.width,
							   this.objects[i].texture.height);

				//Creates buffers and textures
				//
				vBufferReference = this.objects[i].vBuffer;
				iBufferReference = this.objects[i].iBuffer;

				vBuffer = new BUFFER.new(vBufferReference, "array");
				iBuffer = new BUFFER.new(iBufferReference, "elements");

				//Handles attributes
				//
				let attributes = Object.keys(this.objects[i].attributes);

				for(let j = 0; j < attributes.length; j++){
					this.program.useHandle("attribute",
						this.locations.attributes[attributes[j]],
						this.objects[i].attributes[attributes[j]].size,
						this.objects[i].attributes[attributes[j]].totalBytes,
						this.objects[i].attributes[attributes[j]].offset);
				}

				//Handles.uniforms
				//
				let uniforms = Object.keys(this.objects[i].uniforms);

				this.program.useHandle("uniform",
					this.locations.uniforms.proj, 0, 0, 0, proj);

				for(let j = 0; j < uniforms.length; j++){
					this.program.useHandle("uniform",
						this.locations.uniforms[uniforms[j]], 0, 0, 0,
						this.objects[i].uniforms[uniforms[j]].value);
				}

				this.program.useHandle("uniform", 
					this.locations.uniforms.world, 0, 0, 0, world);

				//Draws elements
				//
				gl.drawElements(gl.TRIANGLES, this.objects[i].iBuffer.length,
							    gl.UNSIGNED_SHORT, 0);

				//Removes object when necessary
				//
				if(this.objects[i].kill){
				   this.objects.splice(i, 1);
				   i--;
				}
			}

			//Unbinding
			//
			if(vBuffer){
				vBuffer.unbind();
			}
			if(iBuffer){
				iBuffer.unbind();
			}

			return this;
		},
	};

	return GL_ENGINE;
})();