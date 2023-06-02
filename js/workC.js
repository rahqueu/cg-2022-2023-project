//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras = [], camera, scene, renderer;

var geometry, mesh;

var moon, ovni, house;

const materials = new Map(), clock = new THREE.Clock();
var delta;

const keys = {}, movementVector = new THREE.Vector2(0, 0);

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff')
    scene.add(new THREE.AxesHelper(50));

    createMoon(0, 50, 0);
    createOVNI(5, 7.5, 0);
    createHouse(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    const positions = new Array(new Array(-10, 0, 0), // frontal
                                new Array(0, 0, 10), // lateral
                                new Array(0, -15, 0), // baixo
                                new Array(15, 10, 15), // perspetiva isométrica - projeção ortogonal
                                new Array(50, 50, 50), // perspetiva isométrica - projeção perspetiva
                                new Array(-50, 50, -50)); // perspetiva isométrica - projeção perspetiva

    for (let i = 0; i < 6; i++) {
        if (i == 4 | i == 5) {
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
    materials.set("moon", new THREE.MeshBasicMaterial({ color: 0xfcba03, wireframe: false }));
    materials.set("ovni", new THREE.MeshBasicMaterial({ color: 0x707070, wireframe: false }));
    materials.set("cockpit", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false }));
    materials.set("beam", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false }));
    materials.set("light", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false }));
}

function setVertices(xi, yi, zi, xf, yf, zf) {
    'use strict';
    const vertices = new Float32Array([
        0, 4.5, 5,   0, 4.5, -5,     //top points
        0, -4.5, 5,  0, -4.5, -5     //bottom points
    ]);
    return vertices;
}

function createMoon(x, y, z) {
    'use strict';

    moon = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(1, 25, 50);
    mesh = new THREE.Mesh(geometry, materials.get("moon"));
    moon.add(mesh);

    scene.add(moon);
    moon.position.set(x, y, z);
}

function createOVNILights() {
    'use strict';
    const nLights = 8;
    let theta;
    for (let i = 0; i < nLights; i++) {
        theta = i * (2 * Math.PI) / nLights;

        var pivot = new THREE.Object3D();
        pivot.rotation.y = theta;
        ovni.add(pivot);
        
        geometry = new THREE.SphereGeometry(0.25, 25, 50, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
        mesh = new THREE.Mesh(geometry, materials.get("light"));
        mesh.rotation.x = Math.PI;
        mesh.position.set(1.5, -0.25, 0);

        pivot.add(mesh);
    }
}

function createOVNI(x, y, z) {
    'use strict';

    ovni = new THREE.Object3D();

    // body
    geometry = new THREE.SphereGeometry(2.5, 25, 50);
    mesh = new THREE.Mesh(geometry, materials.get("ovni"));
    mesh.position.set(0, 0, 0);
    mesh.scale.set(1, 0.2, 1);
    ovni.add(mesh);

    // cockpit - half sphere
    geometry = new THREE.SphereGeometry(1, 25, 50, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
    mesh = new THREE.Mesh(geometry, materials.get("cockpit"));
    mesh.position.set(0, 0.4, 0);
    ovni.add(mesh);

    // cilinder
    geometry = new THREE.CylinderGeometry(1.25, 1.25, 0.15, 50);
    mesh = new THREE.Mesh(geometry, materials.get("beam"));
    mesh.position.set(0, -0.45, 0);
    ovni.add(mesh);
    
    createOVNILights();

    ovni.position.set(x, y, z);
    scene.add(ovni);
}

function createHouseWall(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    var wall = new THREE.Mesh(geometry, materials.get("beam"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createHouse(x, y, z) {
    'use strict';

    house = new THREE.Object3D();

    var v = new Float32Array([
        0, 0, 0,  // 0
        0, 0, 14,  // 1
        0, 7, 14,  // 3
        0, 7, 0   // 2
    ]);
    createHouseWall(v, x, y, z);

    v = new Float32Array([
        0, 0, 14,  // 0
        8, 0, 14,  // 1
        8, 7, 14,  // 3
        0, 7, 14   // 2
    ]);
    createHouseWall(v, x, y, z);

    var v = new Float32Array([
        8, 7, 0,  // 0
        8, 7, 14,  // 1
        8, 0, 14,  // 3
        8, 0, 0   // 2
    ]);
    createHouseWall(v, x, y, z);

    v = new Float32Array([
        8, 0, 0,  // 0
        0, 0, 0,  // 1
        0, 7, 0,  // 3
        8, 7, 0   // 2
    ]);
    createHouseWall(v, x, y, z);

    scene.add(house);
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
function update(delta) {
    'use strict';

    ovni.rotation.y += 0.01;

    movementVector.set(0, 0);

    if (keys['ArrowUp']) {
        movementVector.x -= 100;
    }
    if (keys['ArrowDown']) {
        movementVector.x += 100;
    }
    if (keys['ArrowLeft']) {
        movementVector.y += 100;
    }
    if (keys['ArrowRight']) {
        movementVector.y -= 100;
    }

    ovni.position.x += movementVector.x * delta;
    ovni.position.z += movementVector.y * delta;

    //house.rotation.y += Math.PI / 8;
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

    delta = clock.getDelta();

    update(delta);
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
        case 49: // 1 -> camera fixa projecção perspectiva para ver toda a cena
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
        case 54: // 6
            camera = cameras[5];
            break;
        case 37: // arrow
        case 38: // arrow
        case 39: // arrow
        case 40: // arrow
            keys[e.code] = true;
            break;
        // q -> sombreamento Gouraud
        // w -> sombreamento Phong
        // e -> sombreamento Cartoon
        // r -> ativar e desativar o cálculo da iluminação

        // p -> ativar/desativar luzes pontuais
        // s -> ativar/desativar luz spotlight
        // d -> ativar/desativar luz global (lua cheia)
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    keys[e.code] = false;
}