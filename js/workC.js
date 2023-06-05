//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras = [], camera, scene, renderer;

var geometry, mesh;

var moon, ovni, house, tree;

// lights
var globalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
var ambientLight = new THREE.AmbientLight(0x404040, 0.3);
var spotLight = new THREE.SpotLight(0xede0c2, 0.5, 7.5, Math.PI / 4.0, 0.5, 1);

var whatMaterial = "basic";

var pointLight1 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight3 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight4 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight5 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight6 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight7 = new THREE.PointLight(0xFFFFFF, 0.5);
var pointLight8 = new THREE.PointLight(0xFFFFFF, 0.5);

// materials
const materials = new Map(), clock = new THREE.Clock();
var delta;

const keys = {}, movementVector = new THREE.Vector2(0, 0);

// shade
let shadeCalculation = false;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#262626')
    scene.add(new THREE.AxesHelper(50));

    createMoon(0, 40, 0);
    createOVNI(5, 7.5, 0);
    createHouse(0, 0, 0);
    createTree();
    createTree();
    createTree();

    //global light
    globalLight.position.set(2, 10, 1);
    globalLight.target.position.set(0, 0, 0);
    //globalLight.visible = true;
    scene.add(globalLight);

    //ambient light
    scene.add(ambientLight);
    //ambientLight.visible = true;

    //spotlight
    //createSpotLight(5, 7.05, 0);
    //spotLight.visible = true;
    spotLight.position.set(0, -25, 0);
    spotLight.target.position.set = ovni.position;
    scene.add(spotLight);
    scene.add(spotLight.target);    
    // spotLight.castShadow = true;

    //pontual lights
    pointLight1.position.set(0, 5, 0);
    pointLight1.visible = true;
    scene.add(pointLight1);

    scene.add(pointLight2);
    pointLight2.position.set(0, 0, 0);
    pointLight2.visible = true;

    scene.add(pointLight3);
    pointLight3.position.set(0, 0, 0);
    pointLight3.visible = true;

    scene.add(pointLight4);
    pointLight4.position.set(0, 0, 0);
    pointLight4.visible = true;

    scene.add(pointLight5);
    pointLight5.position.set(0, 0, 0);
    pointLight5.visible = true;

    scene.add(pointLight6);
    pointLight6.position.set(0, 0, 0);
    pointLight6.visible = true;

    scene.add(pointLight7);
    pointLight7.position.set(0, 0, 0);
    pointLight7.visible = true;

    scene.add(pointLight8);
    pointLight8.position.set(0, 0, 0);
    pointLight8.visible = true;
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    const positions = new Array(new Array(-50, 0, 0), // frontal
                                new Array(0, 0, 50), // lateral
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
    camera = cameras[5];
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

    // TODO: update house materials

    materials.set("moon", null);
    materials.set("ovni", null);
    materials.set("cockpit", null);
    materials.set("beam", null);
    materials.set("light", null);
    materials.set("wall", null);
    materials.set("window", null);

    //basic
    materials.set("moon basic material", new THREE.MeshBasicMaterial({ color: 0xfcba03, wireframe: false, side: THREE.DoubleSide}));
    // , emissive: 0xfcf74c, emissiveIntensity: 0.5
    materials.set("ovni basic material", new THREE.MeshBasicMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materials.set("cockpit basic material", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materials.set("beam basic material", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("light basic material", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("front wall basic material", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }));
    materials.set("back wall basic material", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.BackSide }));
    materials.set("side wall 1 basic material", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.BackSide }));
    materials.set("side wall 2 basic material", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }));
    materials.set("front window basic material", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false, side: THREE.FrontSide }));
    materials.set("side window basic material", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false, side: THREE.BackSide }));
    materials.set("front ceiling basic material", new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }));
    materials.set("back ceiling basic material", new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }));
    materials.set("side ceiling 1 basic material", new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }));
    materials.set("side ceiling 2 basic material", new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false, side: THREE.BackSide }));

    materials.set("tree trunk basic material", new THREE.MeshBasicMaterial({ color: 0xa45729, wireframe: false, side: THREE.DoubleSide }));
    materials.set("tree foliage basic material", new THREE.MeshBasicMaterial({ color: 0x013220, wireframe: false, side: THREE.DoubleSide }));

    //lambert
    materials.set("moon lambert material", new THREE.MeshLambertMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcf74c, emissiveIntensity: 0.5, side: THREE.DoubleSide}));
    materials.set("ovni lambert material", new THREE.MeshLambertMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materials.set("cockpit lambert material", new THREE.MeshLambertMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materials.set("beam lambert material", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("light lambert material", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));

    //phong
    materials.set("moon phong material", new THREE.MeshPhongMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcf74c, emissiveIntensity: 0.5, side: THREE.DoubleSide }));
    materials.set("ovni phong material", new THREE.MeshPhongMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materials.set("cockpit phong material", new THREE.MeshPhongMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materials.set("beam phong material", new THREE.MeshPhongMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("light phong material", new THREE.MeshPhongMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));

    //toon
    materials.set("moon toon material", new THREE.MeshToonMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcf74c, emissiveIntensity: 0.5, side: THREE.DoubleSide }));
    materials.set("ovni toon material", new THREE.MeshToonMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materials.set("cockpit toon material", new THREE.MeshToonMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materials.set("beam toon material", new THREE.MeshToonMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("light toon material", new THREE.MeshToonMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
}

function updateMaterials() {
    'use strict';

    // TODO: update house materials

    if (whatMaterial == "lambert") {
        materials.set("moon", materials.get("moon lambert material"));
        materials.set("ovni", materials.get("ovni lambert material"));
        materials.set("cockpit", materials.get("cockpit lambert material"));
        materials.set("beam", materials.get("beam lambert material"));
        materials.set("light", materials.get("light lambert material"));
    } else if (whatMaterial == "phong") {
        materials.set("moon", materials.get("moon phong material"));
        materials.set("ovni", materials.get("ovni phong material"));
        materials.set("cockpit", materials.get("cockpit phong material"));
        materials.set("beam", materials.get("beam phong material"));
        materials.set("light", materials.get("light phong material"));
    } else if (whatMaterial == "toon") {
        materials.set("moon", materials.get("moon toon material"));
        materials.set("ovni", materials.get("ovni toon material"));
        materials.set("cockpit", materials.get("cockpit toon material"));
        materials.set("beam", materials.get("beam toon material"));
        materials.set("light", materials.get("light toon material"));
    } else {
        materials.set("moon", materials.get("moon basic material"));
        materials.set("ovni", materials.get("ovni basic material"));
        materials.set("cockpit", materials.get("cockpit basic material"));
        materials.set("beam", materials.get("beam basic material"));
        materials.set("light", materials.get("light basic material"));
    }
}

function createTree() {
    'use strict';

    tree = new THREE.Object3D();

    //trunk
    geometry = new THREE.CylinderGeometry(1, 1, 5, 25);
    mesh = new THREE.Mesh(geometry, materials.get("tree trunk basic material"));
    tree.add(mesh);

    //branch
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 50);
    mesh = new THREE.Mesh(geometry, materials.get("tree trunk basic material"));
    mesh.rotation.z = Math.PI/4; 
    mesh.position.set(-1, 1.5, 0);
    tree.add(mesh);

    //branch
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 50);
    mesh = new THREE.Mesh(geometry, materials.get("tree trunk basic material"));
    mesh.rotation.z = -Math.PI/4; 
    mesh.position.set(1, 2.5, 0);
    tree.add(mesh);

    //branch
    geometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 50);
    mesh = new THREE.Mesh(geometry, materials.get("tree trunk basic material"));
    mesh.rotation.z = Math.PI/4; 
    mesh.position.set(0.5, 4, 0);
    tree.add(mesh);

    //foliage
    geometry = new THREE.SphereGeometry(1.5, 32, 16);
    geometry.rotateZ(Math.PI/2);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, materials.get("tree foliage basic material"));
    mesh.position.set(-4, 3, 0);
    tree.add(mesh);

    //foliage
    geometry = new THREE.SphereGeometry(1.5, 32, 16);
    geometry.rotateZ(Math.PI/2);
    geometry.scale(2, 1, 1);
    mesh = new THREE.Mesh(geometry, materials.get("tree foliage basic material"));
    mesh.position.set(1, 5, 0);
    tree.add(mesh);

    scene.add(tree);

    var spawnArea = new THREE.Box3(
        new THREE.Vector3(-25, 0, -25), // Min coordinates of the spawn area
        new THREE.Vector3(25, 0, 25)    // Max coordinates of the spawn area
      );

    tree.position.set(
        THREE.MathUtils.randFloat(spawnArea.min.x, spawnArea.max.x),
        2.5,
        THREE.MathUtils.randFloat(spawnArea.min.z, spawnArea.max.z));
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

// TODO: rework house modeling functions

function createFrontWindow(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var window = new THREE.Mesh(geometry, materials.get("front window basic material"));
    window.position.set(x, y, z);

    house.add(window);
}

function createSideWindow(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var window = new THREE.Mesh(geometry, materials.get("side window basic material"));
    window.position.set(x, y, z);

    house.add(window);
}

function createFrontCeiling(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("front ceiling basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createBackCeiling(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("back ceiling basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createSideCeilingOne(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("side ceiling 1 basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createSideCeilingTwo(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("side ceiling 2 basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createFrontWallComponent(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("front wall basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createBackWallComponent(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("back wall basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createSideWallOneComponent(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("side wall 1 basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createSideWallTwoComponent(vertices, x, y, z) {
    'use strict';

    geometry = new THREE.BufferGeometry();
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    var wall = new THREE.Mesh(geometry, materials.get("side wall 2 basic material"));
    wall.position.set(x, y, z);

    house.add(wall);
}

function createWallOne(x, y, z) {
    'use strict';

    var v = new Float32Array([
        0, 0, 0,  // 0
        3, 0, 0,  // 1
        3, 7, 0,  // 2
        0, 7, 0   // 3
    ]);
    createSideWallOneComponent(v, x, y, z);

    v = new Float32Array([
        3, 0, 0,  // 0
        5, 0, 0,  // 1
        5, 3, 0,  // 2
        0, 3, 0   // 3
    ]);
    createSideWallOneComponent(v, x, y, z);

    v = new Float32Array([
        3, 5, 0,  // 0
        5, 5, 0,  // 1
        5, 7, 0,  // 2
        0, 7, 0   // 3
    ]);
    createSideWallOneComponent(v, x, y, z);

    v = new Float32Array([
        5, 0, 0,  // 0
        8, 0, 0,  // 1
        8, 7, 0,  // 2
        5, 7, 0   // 3
    ]);
    createSideWallOneComponent(v, x, y, z);

    v = new Float32Array([
        3, 3, 0,  // 0
        5, 3, 0,  // 1
        5, 5, 0,  // 2
        3, 5, 0   // 3
    ]);
    createSideWindow(v, x, y, z);
}

function createWallTwo(x, y, z) {
    'use strict';

    var v = new Float32Array([
        0, 0, 14,  // 0
        8, 0, 14,  // 1
        8, 7, 14,  // 2
        0, 7, 14   // 3
    ]);
    createSideWallTwoComponent(v, x, y, z);

    /*
    var v = new Float32Array([
        0, 0, 14,  // 0
        3, 0, 14,  // 1
        3, 7, 14,  // 2
        0, 7, 14   // 3
    ]);
    createSideWallTwoComponent(v, x, y, z);

    v = new Float32Array([
        3, 0, 14,  // 0
        5, 0, 14,  // 1
        5, 3, 14,  // 2
        0, 3, 14   // 3
    ]);
    createSideWallTwoComponent(v, x, y, z);

    v = new Float32Array([
        3, 5, 14,  // 0
        5, 5, 14,  // 1
        5, 7, 14,  // 2
        0, 7, 14   // 3
    ]);
    createSideWallTwoComponent(v, x, y, z);

    v = new Float32Array([
        5, 0, 14,  // 0
        8, 0, 14,  // 1
        8, 7, 14,  // 2
        5, 7, 14   // 3
    ]);
    createSideWallTwoComponent(v, x, y, z);

    v = new Float32Array([
        3, 3, 14,  // 0
        5, 3, 14,  // 1
        5, 5, 14,  // 2
        3, 5, 14   // 3
    ]);
    createWindow(v, x, y, z);
    */
}

function createWallThree(x, y, z) {
    'use strict';

    var v = new Float32Array([
        0, 0, 0,  // 0
        0, 0, 2,  // 1
        0, 4, 2,  // 2
        0, 4, 0   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    var v = new Float32Array([
        0, 4, 0,  // 0
        0, 4, 14,  // 1
        0, 7, 14,  // 2
        0, 7, 0   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    v = new Float32Array([
        0, 0, 4,  // 0
        0, 0, 6,  // 1
        0, 4, 6,  // 2
        0, 4, 4   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    v = new Float32Array([
        0, 0, 6,  // 0
        0, 0, 8,  // 1
        0, 2, 8,  // 2
        0, 2, 6   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    v = new Float32Array([
        0, 0, 8,  // 0
        0, 0, 10,  // 1
        0, 4, 10,  // 2
        0, 4, 8   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    v = new Float32Array([
        0, 0, 10,  // 0
        0, 0, 12,  // 1
        0, 2, 12,  // 2
        0, 2, 10   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    v = new Float32Array([
        0, 0, 12,  // 0
        0, 0, 14,  // 1
        0, 4, 14,  // 2
        0, 4, 12   // 3
    ]);
    createFrontWallComponent(v, x, y, z);

    // DOOR
    v = new Float32Array([
        0, 0, 2,  // 0
        0, 0, 4,  // 1
        0, 4, 4,  // 2
        0, 4, 2   // 3
    ]);
    createFrontWindow(v, x, y, z);

    // WINDOWS
    v = new Float32Array([
        0, 2, 6,  // 0
        0, 2, 8,  // 1
        0, 4, 8,  // 2
        0, 4, 6   // 3
    ]);
    createFrontWindow(v, x, y, z);

    v = new Float32Array([
        0, 2, 10,  // 0
        0, 2, 12,  // 1
        0, 4, 12,  // 2
        0, 4, 10   // 3
    ]);
    createFrontWindow(v, x, y, z);
}

function createWallFour(x, y, z) {
    'use strict';

    var v = new Float32Array([
        8, 0, 0,  // 0
        8, 0, 14,  // 1
        8, 7, 14,  // 2
        8, 7, 0   // 3
    ]);
    createBackWallComponent(v, x, y, z);
}

function createCeiling(x, y, z) {
    'use strict';

    var v = new Float32Array([
        0, 7, 0,  // 0
        0, 7, 14,  // 1
        4, 11, 14,  // 2
        4, 11, 0   // 3
    ]);
    createFrontCeiling(v, x, y, z);

    v = new Float32Array([
        4, 11, 0,  // 0
        4, 11, 14,  // 1
        8, 7, 14,  // 2
        8, 7, 0   // 3
    ]);
    createBackCeiling(v, x, y, z);

    v = new Float32Array([
        0, 7, 0,  // 0
        4, 11, 0,  // 1
        8, 7, 0  // 2
    ]);
    createSideCeilingOne(v, x, y, z);

    v = new Float32Array([
        0, 7, 14,  // 0
        4, 11, 14,  // 1
        8, 7, 14  // 2
    ]);
    createSideCeilingTwo(v, x, y, z);


}

function createHouse(x, y, z) {
    'use strict';

    house = new THREE.Object3D();

    // SIDE WALL 1
    createWallOne(x, y, z); // just be to clean, put all code here in the future

    // SIDE WALL 2
    createWallTwo(x, y, z);

    // FRONT WALL
    createWallThree(x, y, z);

    // BACK WALL
    createWallFour(x, y, z);

    createCeiling(x, y, z);

    scene.add(house);
}

///////////////////////
/*      LIGHTS       */
///////////////////////

/*
function createSpotLight(x, y, z) {
    'use strict';

    var light = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 1.25, 150), new THREE.MeshBasicMaterial({ color: 0x5d4a80}));

    light.position.set(x, y + 0.2, z);
    scene.add(light);

    var view = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 3, 7.5, 150), new THREE.MeshBasicMaterial({ color: 0x5d4a80}));
    view.position.set(0, -4, 0);

    light.add(view);
}

function updateLights() {
    'use strict';
    pointLight1.visible = !pointLight1.visible;
    pointLight2.visible = !pointLight2.visible;
    pointLight3.visible = !pointLight3.visible;
    pointLight4.visible = !pointLight4.visible;
    pointLight5.visible = !pointLight5.visible;
    pointLight6.visible = !pointLight6.visible;
    pointLight7.visible = !pointLight7.visible;
    pointLight8.visible = !pointLight8.visible;
}
*/

///////////////////////
/* SHADE CALCULATION */
///////////////////////
function updateShadeCalculation(){
    'use strict';
    if (shadeCalculation) {

    } else {

    }
    shadeCalculation = !shadeCalculation;
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
    
    updateMaterials();
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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    createMaterials();
    updateMaterials();
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
        case 80: // p -> luzes pontuais
            updateLights();
            console.log("update point lights");
            break;
        case 82: // r -> cálculo da iluminação
            updateShadeCalculation();
            console.log("update shade calculation");
            break;
        case 83: // s -> luz spotlight
            spotLight.visible = !spotLight.visible;
            console.log("spotlight is visible: " + spotLight.visible);
            break;
        case 68: // d -> luz global
            globalLight.visible = !globalLight.visible;
            console.log("global light is visible: " + globalLight.visible);
            break;
        case 81: // q -> sombreamento Gouraud
            whatMaterial = "gourard";
            updateMaterials();
            console.log("material: " + whatMaterial);
            break;
        case 87: // w -> sombreamento Phong
            whatMaterial = "phong";
            updateMaterials();
            console.log("material: " + whatMaterial);
            break;
        case 69: // e -> sombreamento Cartoon
            whatMaterial = "toon";
            updateMaterials();
            console.log("material: " + whatMaterial);
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    keys[e.code] = false;
}