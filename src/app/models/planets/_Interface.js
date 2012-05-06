define([ 
    'dojo/_base/declare', 
    'dijit/_Widget'
    ], function (declare, _Widget) {
        return declare("app.model.planets._Interface", [_Widget], {
            radius: null, //define planet radius
            mass: null,   //define planet mass
            rotationSpeed: null,  //define planet rotationspeed
            root: null, //3d root object
            position: {
                x:0,
                y:0,
                z:0
            }, //[x,y,z] starting position 
            
            material: function() {
                //override this function to return appropriate material
                var material	= new THREE.MeshNormalMaterial();
                return material;
            },
            
            postCreate: function() {
                var geometry	= new THREE.SphereGeometry( this.radius, 100, 50 );
                geometry.computeTangents();
                this.root	= new THREE.Mesh( geometry, this.material() );
                this.root.position = this.position;
                this.init();
            },
            
            update: function(clock) {
                //clock is the game clock set by the engine
                this.updateAngle(clock);
            },
            
            updateAngle: function(clock) {
                var angle = clock * this.rotationSpeed;
                
                this.root.position = new THREE.Vector3(
                    Math.cos( angle ) * this.root.position.x - Math.sin( angle ) * this.root.position.z,
                    0,
                    Math.sin( angle ) * this.root.position.x + Math.cos( angle ) * this.root.position.z
                    );
                        this.position = this.root.position;
            },
            
            updateRotation: function(clock) {
                
            }
        });
    });