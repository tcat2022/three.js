import * as THREE from "three";
import { FontLoader, TextGeometry } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

let w = window.innerWidth;
let  h = window.innerHeight; 
const renderer  = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w,h)
renderer.setClearColor(new THREE.Color('#5FE7E7'));
document.body.appendChild(renderer.domElement)

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const scene = new THREE.Scene();
//camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement)
//controls.minPolarAngle = Math.PI/1.5;
controls.maxPolarAngle = Math.PI/1.85;
controls.enableDamping = true;
controls.enablePan = false;
let textMaterial;
let textMesh;

const geometry = new THREE.PlaneGeometry( 7, 4  );
const material = new THREE.MeshBasicMaterial( {color:'lightgreen', side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = Math.PI / 2;
plane.position.y = -.5
scene.add( plane );

let hemlight = new THREE.HemisphereLight('#FEF3F7','#45001A',1.75)
scene.add(hemlight)
let ambiantlight = new THREE.AmbientLight('#ffffff',.5)
scene.add(ambiantlight)

var fontLoader = new FontLoader();

        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
      
            var textGeometry = new TextGeometry( 'Happy ' + 'Mothers ' + ' Day', {
                font: font,
                size:.5,
                height: .4,
                depth: 0,
               
            });
            textMaterial = new THREE.MeshStandardMaterial({color:'#FF0362'})
            textMesh = new THREE.Mesh(textGeometry, textMaterial)
            textMesh.receiveShadow = true;
            textMesh.position.set(-3, 0, 0);
            
            
            scene.add(textMesh)
            // Calculate the bounding box of the text mesh
var boundingBox = new THREE.Box3().setFromObject(textMesh);
var center = boundingBox.getCenter(new THREE.Vector3());

// Calculate the distance from the camera to the object based on the bounding box size
 let size = boundingBox.getSize(new THREE.Vector3());
let  maxDim = Math.max(size.x, size.y, size.z);
let  fov1 = camera.fov * (Math.PI / 180);
let  distance = Math.abs(maxDim / Math.sin(fov1 / 2));

// Set the camera position and target
camera.position.copy(center);
camera.position.z = -4;
 distance += Math.abs(2.5/ Math.sin(fov1 / 2));
camera.position.z += distance;

controls.update();
        });

        function onWindowResize() {
            w = window.innerWidth;
            h = window.innerHeight;
        
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        
            
    renderer.setSize(w, h);

    // Resize text
    scene.remove(textMesh);
    createText();
    
    // Resize plane
    scene.remove(plane);
    createPlane();
        }
        
        window.addEventListener('resize', onWindowResize);

function animate() {
	requestAnimationFrame( animate );
controls.update()
	renderer.render( scene, camera );
    console.log(camera.position.z)
}

animate();