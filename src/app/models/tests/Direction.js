define([ 
    'dojo/_base/declare', 
    'dijit/_Widget',
    'dijit/registry'
    ], function (declare, _Widget, registry) {
        return declare("app.model.planets.Direction", [_Widget], {
            root: null, //3d root object
            position: {
                x:50,
                y:0,
                z:0
            }, //[x,y,z] starting position 
            
            
            postCreate: function() {
                console.log('render direction');
                var geometry = new THREE.CylinderGeometry( 0, 10, 100, 3 );
                geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ) );

                var material = new THREE.MeshNormalMaterial();
                
                
                this.root = new THREE.Mesh( geometry, material );
                this.root.scale.x = this.root.scale.y = this.root.scale.z = 0.05;
                this.root.position = this.position;
            },
            
            update: function(clock) {
                //clock is the game clock set by the engine
                var mars;
                if(mars = registry.byId('Mars')) {
                    this.root.lookAt( mars.root.position );
                }
                
//                var mars = registry.byId('Mars');
//                console.log(mars);
//                if(mars.loaded) {
//                    this.root.lookAt( mars.position );
//                }
                
            }
        });
    });