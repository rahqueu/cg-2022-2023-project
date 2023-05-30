//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras = [], camera, scene, renderer;

var geometry, mesh;

var moon, ovni;

const materials = new Map();

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff')
    scene.add(new THREE.AxesHelper(50));

    createMoon();
    createOVNI(5, 7.5, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    const positions = new Array(new Array(10, 0, 0), // frontal
                                new Array(0, 0, 10), // lateral
                                new Array(0, -15, 0), // topo
                                new Array(15, 10, 15), // perspetiva isométrica - projeção ortogonal
                                new Array(50, 50, 50)); // perspetiva isométrica - projeção perspetiva

    for (let i = 0; i < 5; i++) {
        if (i == 4) {
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        } else {
            camera = new THREE.OrthographicCamera(window.innerWidth / -50,
                                            window.innerWidth / 50,
                                            window.innerHeight / 50,
                                            window.innerHeight / -50,
                                            1,
                                            1000);
        }

        camera.position.set(positions[i][0], positions[i][1], positions[i][2]);
        camera.lookAt(scene.position);
        cameras.push(camera);
    }
    camera = cameras[0];
    /*
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.set(25, 25, 25);
    camera.lookAt(scene.position);
    */
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createMaterials() {
    'use strict';
    materials.set("moon", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false }));
    materials.set("ovni", new THREE.MeshBasicMaterial({ color: 0x707070, wireframe: false }));
    materials.set("cockpit", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false }));
    materials.set("beam", new THREE.MeshBasicMaterial({ color: 0xC0C0C0, wireframe: false }));
    materials.set("light", new THREE.MeshBasicMaterial({ color: 0xeeeeee, wireframe: false }));
    /*
    materials.set("trailer", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false }));
    materials.set("wheel", new THREE.MeshBasicMaterial({ color: 0x00000, wireframe: false }));
    materials.set("torso", new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }));
    materials.set("abdomen", new THREE.MeshBasicMaterial({ color: 0xa6a6a6, wireframe: false }));
    materials.set("waist", new THREE.MeshBasicMaterial({ color: 0xa6a6a6, wireframe: false }));
    materials.set("arm", new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }));
    materials.set("leg", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }));
    materials.set("thigh", new THREE.MeshBasicMaterial({ color: 0xa6a6a6, wireframe: false }));
    materials.set("head", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }));
    materials.set("antenna", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }));
    materials.set("eye", new THREE.MeshBasicMaterial({ color: 0xa6a6a6, wireframe: false }));
    materials.set("foot", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }));
    materials.set("pipe", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false }));
    */
}

function createMoon() {
    'use strict';

    moon = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(1, 25, 50);
    mesh = new THREE.Mesh(geometry, materials.get("moon"));
    moon.add(mesh);
    moon.position.set(0, 10, 0);

    scene.add(moon);
}

function createOVNILights(pivot, x, y, z) {
    'use strict';
    const nLights = 8;
    let theta;
    for (let i = 0; i < nLights; i++) {
        theta = i * (2 * Math.PI) / nLights;

        var pivot = new THREE.Object3D();
        pivot.rotation.y = theta;
        ovni.add(pivot);
        
        geometry = new THREE.SphereGeometry(0.1, 25, 50, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
        mesh = new THREE.Mesh(geometry, materials.get("light"));
        mesh.rotation.x = Math.PI;
        mesh.position.set(1.5, -0.5, 0);

        pivot.add(mesh);
    }
}

function createOVNI(x, y, z) {
    'use strict';

    ovni = new THREE.Object3D();

    // body
    geometry = new THREE.CylinderGeometry(1, 2.5, 1, 50);
    mesh = new THREE.Mesh(geometry, materials.get("ovni"));
    mesh.position.set(0, 0, 0);
    ovni.add(mesh);

    // cockpit - half sphere
    geometry = new THREE.SphereGeometry(1, 25, 50, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
    mesh = new THREE.Mesh(geometry, materials.get("cockpit"));
    mesh.position.set(0, 0.5, 0);
    ovni.add(mesh);

    // cilinder
    geometry = new THREE.CylinderGeometry(1.25, 1.25, 0.1, 50);
    mesh = new THREE.Mesh(geometry, materials.get("beam"));
    mesh.position.set(0, -0.5, 0);
    ovni.add(mesh);
    
    createOVNILights();

    ovni.position.set(x, y, z);
    scene.add(ovni);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createMaterials();
    createScene();
    createCameras();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    update();
    render();
    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49: // 1
            camera = cameras[0];
            break;
        case 50: // 2
            camera = cameras[1];
            break;
        case 51: // 3
            camera = cameras[2];
            break;
        case 52: // 4
            camera = cameras[3];
            break;
        case 53: // 5
            camera = cameras[4];
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}