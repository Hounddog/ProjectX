define([ 
    'dojo/_base/declare',
    './_Interface'
], function (declare, _Interface) {
    return declare("app.model.planets.Sun", [_Interface], {
        radius: 13.9000,
        rotationSpeed: 1,
        id: 'Sun',
        position: {
            x:0,
            y:0,
            z:0
        },
            
        uniforms: null,
        composer: null,
            
        vertexShaderText: 
            'uniform vec2 uvScale;'+
            'varying vec2 vUv;'+

            'void main()'+
            '{'+

            'vUv = uvScale * uv;'+
            'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );'+
            'gl_Position = projectionMatrix * mvPosition;'+

            '}',
        fragmentShaderText: 
'            uniform float time;'+
'            uniform vec2 resolution;'+
''+
'            uniform float fogDensity;'+
'            uniform vec3 fogColor;'+
''+
'            uniform sampler2D texture1;'+
'            uniform sampler2D texture2;'+
''+
'            varying vec2 vUv;'+
''+
'            void main( void ) {'+
''+
'                vec2 position = -1.0 + 2.0 * vUv;'+
''+
'                vec4 noise = texture2D( texture1, vUv );'+
'                vec2 T1 = vUv + vec2( 1.5, -1.5 ) * time  *0.02;'+
'                vec2 T2 = vUv + vec2( -0.5, 2.0 ) * time * 0.01;'+
''+
'                T1.x += noise.x * 2.0;'+
'                T1.y += noise.y * 2.0;'+
'                T2.x -= noise.y * 0.2;'+
'                T2.y += noise.z * 0.2;'+
''+
'                float p = texture2D( texture1, T1 * 2.0 ).a;'+
''+
'                vec4 color = texture2D( texture2, T2 * 2.0 );'+
'                vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );'+
''+
'                if( temp.r > 1.0 ){ temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }'+
'                if( temp.g > 1.0 ){ temp.rb += temp.g - 1.0; }'+
'                if( temp.b > 1.0 ){ temp.rg += temp.b - 1.0; }'+
''+
'                gl_FragColor = temp;'+
''+
'                float depth = gl_FragCoord.z / gl_FragCoord.w;'+
'                const float LOG2 = 1.442695;'+
'                float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );'+
'                fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );'+
''+
'                gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );'+
''+
'            }'
        ,
            
            
            
            
        material: function() {
            this.uniforms = {

                fogDensity: {
                    type: "f", 
                    value: 0.01
                },
                fogColor: {
                    type: "v3", 
                    value: new THREE.Vector3( 0, 0, 0 )
                },
                time: {
                    type: "f", 
                    value: 1.0
                },
                resolution: {
                    type: "v2", 
                    value: new THREE.Vector2(3,1)
                },
                uvScale: {
                    type: "v2", 
                    value: new THREE.Vector2( 3.0, 3.0 )
                },
                texture1: {
                    type: "t", 
                    value: 0, 
                    texture: THREE.ImageUtils.loadTexture( "app/models/planets/images/sun/cloud.png" )
                },
                texture2: {
                    type: "t", 
                    value: 1, 
                    texture: THREE.ImageUtils.loadTexture( "app/models/planets/images/sun/lavatile.jpg" )
                }

            };

            this.uniforms.texture1.texture.wrapS = this.uniforms.texture1.texture.wrapT = THREE.Repeat;
            this.uniforms.texture2.texture.wrapS = this.uniforms.texture2.texture.wrapT = THREE.Repeat;

            var size = 0.65;

            var material = new THREE.ShaderMaterial( {

                uniforms: this.uniforms,
                vertexShader: this.vertexShaderText,
                fragmentShader: this.fragmentShaderText
            } );
                
            return material;
        },
            
        init: function() {
            var light = new THREE.SpotLight( 0xFFFFFF,1000 ,0, true );
            this.root.add(light);
            
            var renderModel = new THREE.RenderPass( this.engine.scene, this.engine.camera );
            var effectBloom = new THREE.BloomPass( 1.25 );
            var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

            effectFilm.renderToScreen = true;

            this.composer = new THREE.EffectComposer( this.engine.renderer );

            this.composer.addPass( renderModel );
            this.composer.addPass( effectBloom );
            this.composer.addPass( effectFilm );
        },
            
        update: function(clock) {
            var delta  = clock * 100;
            this.uniforms.time.value += 1 * delta;
            this.root.rotation.y += 0.00125 * delta;
            this.root.rotation.x += 0.005 * delta;
            this.composer.render( 0.01 );
        }
    });
});