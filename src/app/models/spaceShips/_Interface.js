define([ 
    'dojo/_base/declare', 
    'dijit/_Widget',
    'dijit/registry'
    ], function (declare, _Widget, registry) {
        return declare("app.model.spcaeShips._Interface", [_Widget], {
            root: null, //3d root object
            position: {
                x:0,
                y:0,
                z:0
            }, //[x,y,z] starting position 
            
            shipModel: '',//place 3d blender model here
            
            cameraControls: null,
            camera: null,
            keyboard: null,
            
            material: function() {
                //override this function to return appropriate material
                var material	= new THREE.MeshNormalMaterial();
                return material;
            },
            
            postCreate: function() {
                if(this.gameControls) {
                    this.addGameControls();
                }
                var loader = new THREE.JSONLoader();
                loader.load(this.shipModel, dojo.hitch(this, this.loadShip) );        
            },
        
            loadShip: function(ship) {
                ship.applyMatrix( new THREE.Matrix4());
                var material = new THREE.MeshNormalMaterial();
                this.root = new THREE.Mesh( ship, material );
                this.root.scale.set(0.1, 0.1, 0.1);
                this.root.position = this.position;
                this.onComplete();
            },
            onComplete: function() {},
            
            update: function(delta) {
                //clock is the game clock set by the engine
                //var mars;
                //if(mars = registry.byId('Mars')) {
                //    this.root.lookAt( mars.root.position );
                //}
                //console.log('update ship');
                if(this.gameControls) {
                    console.log(this.root.position);
                    this.camera.lookAt( 
                        this.root.position 
                        );
                    this.cameraControls.target.set( this.root.position.x, this.root.position.y, this.root.position.z );
                    //this.cameraControls.target = this.position;

                    //this.camera.lookAt(this.root.position);
                    this.shipControls(delta);
                }
            },
            
            addGameControls: function() {
                // put a camera in the scene
                this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
                this.camera.position.set(0, 0, 50);
                

                // create a camera contol
                this.cameraControls = new THREE.TrackballControls( this.camera, this.engine.renderer.domElement );
                
                this.cameraControls.rotateSpeed = 1.0;
                this.cameraControls.zoomSpeed = 1.2;
                this.cameraControls.panSpeed = 0.2;

                this.cameraControls.noZoom = false;
                this.cameraControls.noPan = false;

                this.cameraControls.staticMoving = false;
                this.cameraControls.dynamicDampingFactor = 0.3;

                this.cameraControls.minDistance = 1 * 1.1;
                this.cameraControls.maxDistance = 1 * 100;

                this.cameraControls.keys = [ 65, 83, 68 ];
                this.keyboard = new THREEx.KeyboardState();
            },
            addCamera: function() {
                this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
                this.camera.position.set(0, 0, 50);
                this.engine.scene.add(this.camera);
            },
            shipControls: function(delta) {
                if( this.keyboard.pressed("a")) {
                    this.root.rotation.y += 0.01;
                    if(this.root.rotation.z <= 1){
                        this.root.rotation.z -= this.speed/1000;
                    }
                } else if( this.keyboard.pressed("d")) {
                    this.root.rotation.y -= 0.01;
                    if(this.root.rotation.z >= -1){
                        this.root.rotation.z += this.speed/1000;
                    }
                } else {
                    if(this.root.rotation.z < 0){
                        this.root.rotation.z += 0.001;
                    }
            
                    if(this.root.rotation.z > 0){
                        this.root.rotation.z -= 0.001;
                    }
            
                }
        
                var sX;
                var sZ;
                var a =  this.root.rotation.y;
                var p = this.root.position;
                if ( this.keyboard.pressed("s") ) {
                    if(this.speed >= this.maxSpeed){
                        sX = this.maxSpeed;
                        sZ = this.maxSpeed;
                    } else {
                        sX = (this.speed +=0.1);
                        sZ = (this.speed +=0.1); 
                    }
                } else {
                    sX =0;
                    sZ =0;
                }
                if (this.keyboard.pressed("w")){
                    if(this.speed <= 5) {
                        this.speed = 5;
                        this.speed = 5;
                    } else {
                        this.speed += 0.1;
                    }
                } else {
                    this.speed = 0;
                }
                
                sX = this.speed;
                sZ = this.speed;
        
                var v = {
                    x: 1,
                    z: 0
                }
                p.z += sX * (v.x * Math.cos(a) - v.z * Math.sin(a));
                p.x += sZ * (v.x * Math.sin(a) + v.z * Math.cos(a));
        
            }
        });
    });