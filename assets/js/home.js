window.addEventListener( 'load', function(){
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var width = window.innerWidth,
        height = window.innerHeight;

    var params = {
        nbBalls : 40,
        color1 : [ 30, 38, 48 ],
        color2 : [ 251, 53, 80 ]
    };

    var container, camera, scene, renderer,
        uniforms = {
            u_BLUE: {
                type: "v3",
                value: new THREE.Vector3( params.color1[ 0 ] / 255 , params.color1[ 1 ] / 255, params.color1[ 2 ] / 255 )
            },
            u_RED: {
                type: "v3",
                value: new THREE.Vector3( params.color2[ 0 ] / 255 , params.color2[ 1 ] / 255, params.color2[ 2 ] / 255 )
            },
            u_pos: {
                type: "v3v",
                value: [].map.call(
                    ( new Array( params.nbBalls ).fill( 0 ) ),
                    d => new THREE.Vector3( Math.random() * width, Math.random() * height, 40 + Math.random() * 100 )
                )
            }
        },
        lissajous = [].map.call(
            new Array( params.nbBalls ).fill( 0 ),
            d => {
                return {
                    a: .2 + Math.random() ,
                    b: 1. + Math.random() * 5,
                    n: ~~ ( Math.random() * 30 )
                }
            }
        );




    ( function init() {
        camera = new THREE.Camera();
        camera.position.z = 1;

        scene = new THREE.Scene();

        var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
        var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: "#define NB_BALLS " + params.nbBalls + "\n" + document.getElementById( 'fragmentShader' ).textContent
        } );
        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );

        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );

        onWindowResize();
        window.addEventListener( 'resize', onWindowResize, false );
    } )();

    function onWindowResize( event ) {
        width = window.innerWidth;
        height = window.innerHeight;

        renderer.setSize( width, height );
    }

    ( function animate( t ) {
        requestAnimationFrame( animate );

        uniforms.u_pos.value.forEach( ( d, i ) => {
            var tmp = ( i + t / 500 * lissajous[ i ].n ) / 200;
            var x = width / 2 + Math.cos( tmp * lissajous[ i ].a ) * ( width / 2 - 20 );
            var y = height / 2 + Math.sin( tmp * lissajous[ i ].b ) * ( height / 2 - 20 );
            d.setX( x );
            d.setY( y );
        } );

        renderer.render( scene, camera );
    } )( 0 );
} );
