import * as THREE from 'three';
import { Font, FontLoader, TextGeometry, OBJLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 20)
directionalLight.position.y = 1
directionalLight.position.z = 1

scene.add(directionalLight)

const pointLightSphere = new THREE.SphereGeometry( 0.5, 16, 8 );

const pointLight = new THREE.PointLight( 0xFFFFFF, 100 );
pointLight.add( new THREE.Mesh( pointLightSphere, new THREE.MeshStandardMaterial( { color: 0xFFFFFF, wireframe: true } ) ) );
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

const loader = new FontLoader();

let font: Font | null = null;
let bob: THREE.Mesh<TextGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap> | null = null;
let object: any = null;

loader.load(
    // resource URL
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (loadedFont) => {
        font = loadedFont;
        const textGeometry = new TextGeometry("Bob", {
            font: font,
            depth: 0.25,
            size: 1,
        })
        textGeometry.center();
        const material = new THREE.MeshStandardMaterial( { color: 0xFF3333, metalness: 0.98, roughness: 0.5 } );
        bob = new THREE.Mesh(textGeometry, material);

        pointLight.lookAt(bob.position)

        scene.add(bob);
        camera.lookAt(bob.position)
    }
)

// instantiate a loader
const objLoader = new OBJLoader();
// load a resource
objLoader.load(
	// resource URL
	'models/obj/walt/WaltHead.obj',
	// called when resource is loaded
	function ( obj ) {
        object = obj;
        object.scale.multiplyScalar( 0.025 );
		object.position.y = 1;
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshStandardMaterial( { color: 0x00FF00, wireframe: true } );
            }
        } );
        
		scene.add(object );
	},
);

const clock = new THREE.Clock();

function animate() {

    
    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();
    if ( object ) object.rotation.y += 0.5 * delta;
    
    pointLight.position.x = Math.sin( time * 0.5 ) * 2;
	pointLight.position.z = Math.cos( time * 0.5 ) * 2;
    
    if (bob !== null) {
        bob.rotation.y += 0.01
        camera.position.z = Math.cos( time * 0.5 ) * 2;
        camera.lookAt(bob.position)
    }

	renderer.render( scene, camera );
}