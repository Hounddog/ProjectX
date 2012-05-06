define([ 
    'dojo/_base/declare',
    './_Interface'
    ], function (declare, _Interface) {
        return declare("app.model.planets.Earth", [_Interface], {
            radius: 6.378,
            rotationSpeed: 1.2,
            id: 'Earth',
            position: {
                x:149.600,
                y:0,
                z:0
            },
            material: function() {
                var planetTexture = THREE.ImageUtils.loadTexture( "app/models/planets/images/earth/earth_atmos_2048.jpg" ),
                cloudsTexture     = THREE.ImageUtils.loadTexture( "app/models/planets/images/earth/earth_clouds_1024.png" ),
                normalTexture     = THREE.ImageUtils.loadTexture( "app/models/planets/images/earth/earth_normal_2048.jpg" ),
                specularTexture   = THREE.ImageUtils.loadTexture( "app/models/planets/images/earth/earth_specular_2048.jpg" );
       
                var shader = THREE.ShaderUtils.lib[ "normal" ],
                uniforms = THREE.UniformsUtils.clone( shader.uniforms );

                uniforms[ "tNormal" ].texture = normalTexture;
                uniforms[ "uNormalScale" ].value = 0.85;

                uniforms[ "tDiffuse" ].texture = planetTexture;
                uniforms[ "tSpecular" ].texture = specularTexture;

                uniforms[ "enableAO" ].value = false;
                uniforms[ "enableDiffuse" ].value = true;
                uniforms[ "enableSpecular" ].value = true;

                uniforms[ "uDiffuseColor" ].value.setHex( 0xffffff );
                uniforms[ "uSpecularColor" ].value.setHex( 0x666666 );
                uniforms[ "uAmbientColor" ].value.setHex( 0x000000 );

                uniforms[ "uShininess" ].value = 20;

                uniforms[ "uDiffuseColor" ].value.convertGammaToLinear();
                uniforms[ "uSpecularColor" ].value.convertGammaToLinear();
                uniforms[ "uAmbientColor" ].value.convertGammaToLinear();

                var material = new THREE.ShaderMaterial({
                    fragmentShader: shader.fragmentShader,
                    vertexShader: shader.vertexShader,
                    uniforms: uniforms,
                    lights: true
                });
                return material;
            }
        });
    });