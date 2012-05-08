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
            
            postCreate: function() {
                if(this.gameControls) {
                    this.addGameControls();
                }
                var loader = new THREE.JSONLoader();
                loader.load(this.shipModel, dojo.hitch(this, this.loadShip) );        
            },
        
            loadShip: function(ship) {
                //ship.applyMatrix( new THREE.Matrix4());
                this.root = new THREE.Mesh( ship, new THREE.MeshNormalMaterial() );
                this.root.position = this.position;
                this.root.add(this.camera);
                this.onComplete();
            },
            onComplete: function() {},
            
            update: function(delta) {
                //clock is the game clock set by the engine
                //var mars;
                //if(mars = registry.byId('Mars')) {
                //    this.root.lookAt( mars.root.position );
                //}
                if(this.gameControls) {
                    this.shipControls(delta);
                }
            },
            
            addGameControls: function() {
                this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000 );
                this.camera.position.set(0, 0, 50);
                // create a camera contol
                this.cameraControls = new THREE.TrackballControls( this.camera, this.engine.renderer.domElement );
                
                this.cameraControls.rotateSpeed = 1.0;
                this.cameraControls.zoomSpeed = 1.2;
                this.cameraControls.panSpeed = 0.2;

                this.cameraControls.noZoom = false;
                this.cameraControls.noPan = true;

                this.cameraControls.staticMoving = false;
                this.cameraControls.dynamicDampingFactor = 0.3;

                this.cameraControls.minDistance = 1 * 1.1;
                this.cameraControls.maxDistance = 1 * 100;

                this.cameraControls.keys = [ 100 /*4*/, 104 /*8*/, 102 /*6*/ ];
                this.keyboard = new THREEx.KeyboardState();
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