define([ 
    'dojo/_base/declare', 
    'dijit/_Widget',
    'dojo/_base/array'
    ], function (declare, _Widget, array) {
        return declare("app.Engine", [_Widget], {
            stats:null, 
            scene:null,
            renderer: null,
            camera:null,
            cameraControl:null,
            objectModels: [],
            screenInterfaces: [],
            clock: null,
            
            createRenderer: function() {
                if( Detector.webgl ){
                    this.renderer = new THREE.WebGLRenderer({
                        antialias		: true,	// to get smoother output
                        preserveDrawingBuffer	: true	// to allow screenshot
                    });
                    this.renderer.setClearColorHex( 0xBBBBBB, 1 );
                // uncomment if webgl is required
                //}else{
                //	Detector.addGetWebGLMessage();
                //	return true;
                }else{
                    this.renderer	= new THREE.CanvasRenderer();
                }
                this.renderer.setSize( window.innerWidth, window.innerHeight );
                dojo.byId('container').appendChild(this.renderer.domElement);
            },
            
            addStats: function() {
                // add Stats.js - https://github.com/mrdoob/stats.js
                this.stats = new Stats();
                this.stats.domElement.style.position	= 'absolute';
                this.stats.domElement.style.top	= '0px';
                document.body.appendChild( this.stats.domElement ); 
            },
            
            animate: function(test) {
                // animation loop
                // loop on request animation loop
                // - it has to be at the begining of the function
                // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
                this.requestAnimationFrame( this.animate );

                // do the render
                this.render();

                // update stats
                this.stats.update();
            },
            
            requestAnimationFrame: function() {
                var lastTime = 0;                
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(dojo.hitch(this, function() {
                    this.animate();
                }), 
                timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            },

            
            render:function() {
                var delta = this.clock.getDelta()/100;
                
                array.forEach(this.objectModels, function(model){
                    model.update(delta);
                });
                
                array.forEach(this.screenInterfaces, function(model){
                    model.update(delta);
                });
                // update camera controls
                this.cameraControls.update();

                // actually render the scene
                this.renderer.render( this.scene, this.camera );
            },
            
            init: function() {
                // create a scene
                this.scene = new THREE.Scene();

                // put a camera in the scene
                this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
                this.camera.position.set(0, 0, 50);
                this.scene.add(this.camera);

                // create a camera contol
                this.cameraControls = new THREE.TrackballControls( this.camera, this.renderer.domElement );

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
                
                // this.cameraControls	= new THREEx.DragPanControls(this.camera)

                // transparently support window resize
                THREEx.WindowResize.bind(this.renderer, this.camera);
                // allow 'p' to make screenshot
                //THREEx.Screenshot.bindKey(this.renderer);
                // allow 'f' to go fullscreen where this feature is supported
                //if( THREEx.FullScreen.available() ){
                //    THREEx.FullScreen.bindKey();
                //}
            },
            
            postCreate: function() {
                this.clock = new THREE.Clock();
                this.createRenderer();
                this.addStats();
                this.init();
                this.animate();
                this.loadGameObjects();
            },
            
            loadGameObjects: function() {
                //current function to load game objects until server is ready
                this.loadObject('app/models/planets/Sun');
               // this.loadObject('app/models/planets/Mercury');
               // this.loadObject('app/models/planets/Venus');
                this.loadObject('app/models/planets/Mars');
                //this.loadObject('app/models/planets/Earth');
                
                this.loadObject('app/models/tests/Direction');
                this.loadInterface('app/interface/Navigation');
            },
            
            loadObject: function(model) {
                require([model], dojo.hitch(this, function(ObjectModel){
                    var object = new ObjectModel({'engine': this});
                    this.scene.add( object.root );
                    this.objectModels.push(object);
                }));   
            },
            
            loadInterface: function(interFaceScreen) {
                require([interFaceScreen], dojo.hitch(this, function(ObjectInterface){
                    var screen = new ObjectInterface({'engine': this});
                    this.screenInterfaces.push(screen);
                }));
            }
        });
    });