//import { VRButton } from 'three/addons/webxr/VRButton.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var cameras = [], camera, scene, bufferSceneTerrain, bufferTextureTerrain, bufferSceneSky, bufferTextureSky, renderer;

var geometry, mesh;

var moon, ovni, house, tree;
var skydome, terrain;

var treePos = [], trees = [];

// lights
var ambientLight = new THREE.AmbientLight(0x404040, 0.3);

var globalLight = new THREE.DirectionalLight(0xFFEA00, 0.8);

var whatMaterial = "lambert";

// materials
const materials = new Map(), materialsLambert = new Map(), materialsPhong = new Map(), materialsToon = new Map(), materialsBasic = new Map(), clock = new THREE.Clock();
var delta;

const keys = {}, movementVector = new THREE.Vector2(0, 0);

// shade
let shadeCalculation = true;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#262626')
    scene.add(new THREE.AxesHelper(50));

    createMoon(15, 27, 10);
    createOVNI(5, 23, 0);
    createHouse(0, 0, 0);
    createTree();
    createTree();
    createTree();

    createSkydome(0, -10, 0);
    createTerrain(0, -5.5, 0);

    //directional light
    globalLight.position.set(moon.position.x, moon.position.y, moon.position.z);
    globalLight.target.position.set(3, 0, 5);
    globalLight.visible = true;
    scene.add(globalLight);
    scene.add(globalLight.target);

    //const globalLightHelper = new THREE.PointLightHelper( globalLight, 1 );
    //scene.add(globalLightHelper);

    //ambient light
    const ambientLightHelper = new THREE.PointLightHelper( ambientLight, 1 );
    scene.add(ambientLightHelper);

    //scene.add(ambientLight);
    //ambientLight.visible = true;    
}

function createTerrainScene() {
    'use strict';
    bufferSceneTerrain = new THREE.Scene();
    bufferSceneTerrain.background = new THREE.Color('#4CBB17');
    bufferTextureTerrain = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { wrapT: THREE.RepeatWrapping, wrapS: THREE.RepeatWrapping, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    createFlowers();
    
    renderer.setRenderTarget(bufferTextureTerrain);
    renderer.render(bufferSceneTerrain, cameras[1]);
    
    renderer.setRenderTarget(null);
    
    bufferTextureTerrain.texture.repeat.set(3,3);
    materials.get("terrain").map = bufferTextureTerrain.texture;
    materials.get("terrain").needsUpdate = true;

}

function createSkyScene() {
    'use strict';
    bufferSceneSky = new THREE.Scene();
    bufferTextureSky = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { wrapT: THREE.RepeatWrapping, wrapS: THREE.RepeatWrapping, minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    createDegrade();
    createStars();
    
    renderer.setRenderTarget(bufferTextureSky);
    renderer.render(bufferSceneSky, cameras[1]);
    renderer.setRenderTarget(null);
    
    bufferTextureSky.texture.repeat.set(10 , 1);
    materials.get("skydome").map = bufferTextureSky.texture;
    materials.get("skydome").needsUpdate = true;
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    const positions = new Array(new Array(-50, 0, 0), // frontal
                                new Array(0, 0, -50), // lateral
                                new Array(0, 50, 0), // baixo
                                new Array(70, 70, 70), // perspetiva isométrica - projeção ortogonal
                                new Array(35, 25, 35), // perspetiva isométrica - projeção perspetiva
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
    camera = cameras[4];
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createMaterials() {
    'use strict';
    const loader = new THREE.TextureLoader();
    const texture = loader.load ('https://web.tecnico.ulisboa.pt/~ist199238/heightmap.png');

    materials.set("skydome", new THREE.MeshPhongMaterial({wireframe: false, side: THREE.DoubleSide }));
    materials.set("terrain", new THREE.MeshPhongMaterial({wireframe: false, side: THREE.DoubleSide, bumpMap: texture, bumpScale: 5, displacementMap: texture, displacementScale: 20}));
    // TODO: update house materials
    materials.set("moon", new THREE.MeshLambertMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcba03 }));
    materials.set("ovni", new THREE.MeshLambertMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materials.set("cockpit", new THREE.MeshLambertMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materials.set("beam", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("light", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materials.set("wall", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }))
    materials.set("window", new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false, side: THREE.FrontSide }))
    materials.set("ceiling", new THREE.MeshLambertMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }))
    materials.set("tree trunk", new THREE.MeshLambertMaterial({ color: 0x8b4513, wireframe: false, side: THREE.DoubleSide }))
    materials.set("tree foliage", new THREE.MeshLambertMaterial({ color: 0x228b22, wireframe: false, side: THREE.DoubleSide }))
    
    createLambertMaterials();
    createPhongMaterials();
    createToonMaterials();
    createBasicMaterials();
}

function createToonMaterials() {
    'use strict';

    materialsToon.set("moon", new THREE.MeshToonMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcba03, emissiveIntensity: 0.7 }));
    materialsToon.set("ovni", new THREE.MeshToonMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materialsToon.set("cockpit", new THREE.MeshToonMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materialsToon.set("beam", new THREE.MeshToonMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsToon.set("light", new THREE.MeshToonMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsToon.set("wall", new THREE.MeshToonMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }));
    materialsToon.set("window", new THREE.MeshToonMaterial({ color: 0x0000ff, wireframe: false, side: THREE.FrontSide }));
    materialsToon.set("ceiling", new THREE.MeshToonMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }));
    materialsToon.set("tree trunk", new THREE.MeshToonMaterial({ color: 0x8b4513, wireframe: false, side: THREE.DoubleSide }));
    materialsToon.set("tree foliage", new THREE.MeshToonMaterial({ color: 0x228b22, wireframe: false, side: THREE.DoubleSide }));
}

function createLambertMaterials() {
    'use strict';

    materialsLambert.set("moon", new THREE.MeshLambertMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcba03 }));
    materialsLambert.set("ovni", new THREE.MeshLambertMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materialsLambert.set("cockpit", new THREE.MeshLambertMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materialsLambert.set("beam", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsLambert.set("light", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsLambert.set("wall", new THREE.MeshLambertMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }))
    materialsLambert.set("window", new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false, side: THREE.FrontSide }))
    materialsLambert.set("ceiling", new THREE.MeshLambertMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }))
    materialsLambert.set("tree trunk", new THREE.MeshLambertMaterial({ color: 0x8b4513, wireframe: false, side: THREE.DoubleSide }))
    materialsLambert.set("tree foliage", new THREE.MeshLambertMaterial({ color: 0x228b22, wireframe: false, side: THREE.DoubleSide }))
}

function createPhongMaterials() {
    'use strict';

    materialsPhong.set("moon", new THREE.MeshPhongMaterial({ color: 0xfcba03, wireframe: false, emissive: 0xfcba03, specular: 0xede791, shininess: 100 }));
    materialsPhong.set("ovni", new THREE.MeshPhongMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materialsPhong.set("cockpit", new THREE.MeshPhongMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materialsPhong.set("beam", new THREE.MeshPhongMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsPhong.set("light", new THREE.MeshPhongMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsPhong.set("wall", new THREE.MeshPhongMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }));
    materialsPhong.set("window", new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: false, side: THREE.FrontSide }));
    materialsPhong.set("ceiling", new THREE.MeshPhongMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }));
    materialsPhong.set("tree trunk", new THREE.MeshPhongMaterial({ color: 0x8b4513, wireframe: false, side: THREE.DoubleSide }));
    materialsPhong.set("tree foliage", new THREE.MeshPhongMaterial({ color: 0x228b22, wireframe: false, side: THREE.DoubleSide }));
}

function createBasicMaterials() {
    'use strict';

    materialsBasic.set("moon", new THREE.MeshBasicMaterial({ color: 0xfcba03, wireframe: false }));
    materialsBasic.set("ovni", new THREE.MeshBasicMaterial({ color: 0x707070, wireframe: false, side: THREE.DoubleSide }));
    materialsBasic.set("cockpit", new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: false, side: THREE.DoubleSide }));
    materialsBasic.set("beam", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsBasic.set("light", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.DoubleSide }));
    materialsBasic.set("wall", new THREE.MeshBasicMaterial({ color: 0xe8d6a2, wireframe: false, side: THREE.FrontSide }));
    materialsBasic.set("window", new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false, side: THREE.FrontSide }));
    materialsBasic.set("ceiling", new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false, side: THREE.FrontSide }));
    materialsBasic.set("tree trunk", new THREE.MeshBasicMaterial({ color: 0x8b4513, wireframe: false, side: THREE.DoubleSide }));
    materialsBasic.set("tree foliage", new THREE.MeshBasicMaterial({ color: 0x228b22, wireframe: false, side: THREE.DoubleSide }));
}

function updateMaterials() {
    'use strict';
    
    // TODO: update house materials

    if (whatMaterial == "lambert") {
        
        moon.children.material = materialsLambert.get("moon");

        ovni.children[0].material = materialsLambert.get("ovni");
        ovni.children[1].material = materialsLambert.get("cockpit");
        ovni.children[2].material = materialsLambert.get("beam");
        for (let i = 3; i < 11; i++) {
            ovni.children[i].material = materialsLambert.get("light");
        }

        for (let i = 0; i < 4; i++) {
            house.children[0].children[i].material = materialsLambert.get("wall");
        }
        house.children[1].children[0].material = materialsLambert.get("wall");
        for (let i = 0; i < 7; i++) {
            house.children[2].children[i].material = materialsLambert.get("wall");
        }
        house.children[3].children[0].material = materialsLambert.get("wall");

        for (let i = 0; i < 4; i++) {
            house.children[4].children[i].material = materialsLambert.get("window");
        }

        for (let i = 0; i < 4; i++) {
            house.children[5].children[i].material = materialsLambert.get("ceiling");
        }

        trees[0].children[0].material = materialsLambert.get("tree trunk");
        trees[0].children[1].material = materialsLambert.get("tree trunk");
        trees[0].children[2].material = materialsLambert.get("tree trunk");
        trees[0].children[3].material = materialsLambert.get("tree trunk");
        trees[0].children[4].material = materialsLambert.get("tree foliage");
        trees[0].children[5].material = materialsLambert.get("tree foliage");

        trees[1].children[0].material = materialsLambert.get("tree trunk");
        trees[1].children[1].material = materialsLambert.get("tree trunk");
        trees[1].children[2].material = materialsLambert.get("tree trunk");
        trees[1].children[3].material = materialsLambert.get("tree trunk");
        trees[1].children[4].material = materialsLambert.get("tree foliage");
        trees[1].children[5].material = materialsLambert.get("tree foliage");

        trees[2].children[0].material = materialsLambert.get("tree trunk");
        trees[2].children[1].material = materialsLambert.get("tree trunk");
        trees[2].children[2].material = materialsLambert.get("tree trunk");
        trees[2].children[3].material = materialsLambert.get("tree trunk");
        trees[2].children[4].material = materialsLambert.get("tree foliage");
        trees[2].children[5].material = materialsLambert.get("tree foliage");

        materialsLambert.shading = THREE.FlatShading;
        materialsLambert.shading = THREE.SmoothShading;
        // materials.needsUpdate = true;

    } else if (whatMaterial == "phong") {
        
        moon.children.material = materialsPhong.get("moon");

        ovni.children[0].material = materialsPhong.get("ovni");
        ovni.children[1].material = materialsPhong.get("cockpit");
        ovni.children[2].material = materialsPhong.get("beam");
        for (let i = 3; i < 11; i++) {
            ovni.children[i].material = materialsPhong.get("light");
        }

        for (let i = 0; i < 4; i++) {
            house.children[0].children[i].material = materialsPhong.get("wall");
        }
        house.children[1].children[0].material = materialsPhong.get("wall");
        for (let i = 0; i < 7; i++) {
            house.children[2].children[i].material = materialsPhong.get("wall");
        }
        house.children[3].children[0].material = materialsPhong.get("wall");

        for (let i = 0; i < 4; i++) {
            house.children[4].children[i].material = materialsPhong.get("window");
        }

        for (let i = 0; i < 4; i++) {
            house.children[5].children[i].material = materialsPhong.get("ceiling");
        }

        trees[0].children[0].material = materialsPhong.get("tree trunk");
        trees[0].children[1].material = materialsPhong.get("tree trunk");
        trees[0].children[2].material = materialsPhong.get("tree trunk");
        trees[0].children[3].material = materialsPhong.get("tree trunk");
        trees[0].children[4].material = materialsPhong.get("tree foliage");
        trees[0].children[5].material = materialsPhong.get("tree foliage");

        trees[1].children[0].material = materialsPhong.get("tree trunk");
        trees[1].children[1].material = materialsPhong.get("tree trunk");
        trees[1].children[2].material = materialsPhong.get("tree trunk");
        trees[1].children[3].material = materialsPhong.get("tree trunk");
        trees[1].children[4].material = materialsPhong.get("tree foliage");
        trees[1].children[5].material = materialsPhong.get("tree foliage");

        trees[2].children[0].material = materialsPhong.get("tree trunk");
        trees[2].children[1].material = materialsPhong.get("tree trunk");
        trees[2].children[2].material = materialsPhong.get("tree trunk");
        trees[2].children[3].material = materialsPhong.get("tree trunk");
        trees[2].children[4].material = materialsPhong.get("tree foliage");
        trees[2].children[5].material = materialsPhong.get("tree foliage");

        materialsPhong.shading = THREE.FlatShading;
        materialsPhong.shading = THREE.SmoothShading;
        materials.needsUpdate = true;

    } else if (whatMaterial == "toon") {
        
        moon.children.material = materialsToon.get("moon");

        ovni.children[0].material = materialsToon.get("ovni");
        ovni.children[1].material = materialsToon.get("cockpit");
        ovni.children[2].material = materialsToon.get("beam");
        for (let i = 3; i < 11; i++) {
            ovni.children[i].material = materialsToon.get("light");
        }

        for (let i = 0; i < 4; i++) {
            house.children[0].children[i].material = materialsToon.get("wall");
        }
        house.children[1].children[0].material = materialsToon.get("wall");
        for (let i = 0; i < 7; i++) {
            house.children[2].children[i].material = materialsToon.get("wall");
        }
        house.children[3].children[0].material = materialsToon.get("wall");

        for (let i = 0; i < 4; i++) {
            house.children[4].children[i].material = materialsToon.get("window");
        }

        for (let i = 0; i < 4; i++) {
            house.children[5].children[i].material = materialsToon.get("ceiling");
        }

        trees[0].children[0].material = materialsToon.get("tree trunk");
        trees[0].children[1].material = materialsToon.get("tree trunk");
        trees[0].children[2].material = materialsToon.get("tree trunk");
        trees[0].children[3].material = materialsToon.get("tree trunk");
        trees[0].children[4].material = materialsToon.get("tree foliage");
        trees[0].children[5].material = materialsToon.get("tree foliage");

        trees[1].children[0].material = materialsToon.get("tree trunk");
        trees[1].children[1].material = materialsToon.get("tree trunk");
        trees[1].children[2].material = materialsToon.get("tree trunk");
        trees[1].children[3].material = materialsToon.get("tree trunk");
        trees[1].children[4].material = materialsToon.get("tree foliage");
        trees[1].children[5].material = materialsToon.get("tree foliage");

        trees[2].children[0].material = materialsToon.get("tree trunk");
        trees[2].children[1].material = materialsToon.get("tree trunk");
        trees[2].children[2].material = materialsToon.get("tree trunk");
        trees[2].children[3].material = materialsToon.get("tree trunk");
        trees[2].children[4].material = materialsToon.get("tree foliage");
        trees[2].children[5].material = materialsToon.get("tree foliage");

    } else if (whatMaterial == "basic") {

        moon.children.material = materialsBasic.get("moon");

        ovni.children[0].material = materialsBasic.get("ovni");
        ovni.children[1].material = materialsBasic.get("cockpit");
        ovni.children[2].material = materialsBasic.get("beam");
        for (let i = 3; i < 11; i++) {
            ovni.children[i].material = materialsBasic.get("light");
        }

        for (let i = 0; i < 4; i++) {
            house.children[0].children[i].material = materialsBasic.get("wall");
        }
        house.children[1].children[0].material = materialsBasic.get("wall");
        for (let i = 0; i < 7; i++) {
            house.children[2].children[i].material = materialsBasic.get("wall");
        }
        house.children[3].children[0].material = materialsBasic.get("wall");

        for (let i = 0; i < 4; i++) {
            house.children[4].children[i].material = materialsBasic.get("window");
        }

        for (let i = 0; i < 4; i++) {
            house.children[5].children[i].material = materialsBasic.get("ceiling");
        }

        trees[0].children[0].material = materialsBasic.get("tree trunk");
        trees[0].children[1].material = materialsBasic.get("tree trunk");
        trees[0].children[2].material = materialsBasic.get("tree trunk");
        trees[0].children[3].material = materialsBasic.get("tree trunk");
        trees[0].children[4].material = materialsBasic.get("tree foliage");
        trees[0].children[5].material = materialsBasic.get("tree foliage");

        trees[1].children[0].material = materialsBasic.get("tree trunk");
        trees[1].children[1].material = materialsBasic.get("tree trunk");
        trees[1].children[2].material = materialsBasic.get("tree trunk");
        trees[1].children[3].material = materialsBasic.get("tree trunk");
        trees[1].children[4].material = materialsBasic.get("tree foliage");
        trees[1].children[5].material = materialsBasic.get("tree foliage");

        trees[2].children[0].material = materialsBasic.get("tree trunk");
        trees[2].children[1].material = materialsBasic.get("tree trunk");
        trees[2].children[2].material = materialsBasic.get("tree trunk");
        trees[2].children[3].material = materialsBasic.get("tree trunk");
        trees[2].children[4].material = materialsBasic.get("tree foliage");
        trees[2].children[5].material = materialsBasic.get("tree foliage");
    }
}

function createFlowers() {
    'use strict';
    let colors = [];
    colors[0] = 0xffffff; // white
    colors[1] = 0xFFEA00; //yellow
    colors[2] = 0xC8A2C8; //lilac
    colors[3] = 0x89cff0; //baby blue
    var c = 0;
    let flowers = [];
    for (let i = 0; i < 100; i++) {
        var flower = new THREE.Object3D;
        geometry = new THREE.CircleGeometry(0.2, 32, 16);
        
        var mat = new THREE.MeshBasicMaterial({color: colors[c++], wireframe: false, side: THREE.DoubleSide}); 
        mesh = new THREE.Mesh(geometry, mat);
        flower.add(mesh);

        handlePosition(0.4 * 0.4, flowers, flower, i);
        bufferSceneTerrain.add(flower);
        if (c == 4) c = 0;
    }

}

function createStars() {
    'use strict';
    let stars = [];
    for (let i = 0; i < 200; i++) {
        var star = new THREE.Object3D;
        geometry = new THREE.SphereGeometry(0.05, 32, 16);
        
        var mat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false, side: THREE.DoubleSide}); 
        mesh = new THREE.Mesh(geometry, mat);
        star.add(mesh);
        handlePosition(0.1 * 0.1, stars, star, i);
        bufferSceneSky.add(star);
    }
}

function createDegrade() {
    'use strict';
    var degrade = new THREE.Object3D;
    geometry = new THREE.PlaneGeometry(window.innerWidth, 30, 1, 1);

    let a = { r: 0.00, g: 0.0467, b: 0.280 } // Dark blue
    let b = { r: 0.224, g: 0.00, b: 0.280 }  // Dark purple

    var colors = new Float32Array([
        a.r, a.g, a.b,      // top left
        a.r, a.g, a.b,      // top right
        b.r, b.g, b.b,      // bottom left
        b.r, b.g, b.b ]);   // bottom right

    // Set the vertex colors
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: false, side: THREE.DoubleSide});
    mesh = new THREE.Mesh(geometry, material);
    degrade.add(mesh);
    degrade.position.set(0, 0, 0);
    bufferSceneSky.add(mesh);
}

function createSkydome(x, y , z) {
    'use strict';

    skydome = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(70, 32, 16, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
    
    mesh = new THREE.Mesh(geometry, materials.get("skydome"));

    skydome.add(mesh);
    skydome.position.set(x, y, z);

    scene.add(skydome);
}

function createTerrain(x, y, z) {
    'use strict';
    terrain = new THREE.Object3D;
    geometry = new THREE.PlaneGeometry(150, 150, 100, 100);
    
    mesh = new THREE.Mesh(geometry, materials.get("terrain"));

    terrain.add(mesh);
    terrain.rotation.x = 3*Math.PI / 2;
    terrain.position.set(x, y, z);
    scene.add(terrain);
}

function createTree() {
    'use strict';

    const ys = [THREE.MathUtils.randFloat(3.5, 8.5),
        THREE.MathUtils.randFloat(3.5, 8.5),
        THREE.MathUtils.randFloat(3.5, 8.5)];

    var spawnArea = new THREE.Box3(
        new THREE.Vector3(-30, 0, -30), // Min coordinates of the spawn area
        new THREE.Vector3(30, 0, 30)    // Max coordinates of the spawn area
      );
    
    const housePos = new THREE.Vector3(house.position.x - 4, 0, house.position.z - 7);
    var houseSize = new THREE.Vector3(16, 11, 28);

    for (var i = 0; i < 3; i++) {
        var tree = new THREE.Object3D();

        //trunk
        geometry = new THREE.CylinderGeometry(1, 1, ys[i], 25);
        mesh = new THREE.Mesh(geometry, materials.get("tree trunk"));
        tree.add(mesh);

        //branch
        geometry = new THREE.CylinderGeometry(0.5, 0.5, ys[i] / 2, 50);
        mesh = new THREE.Mesh(geometry, materials.get("tree trunk"));
        mesh.rotation.z = Math.PI/4; 
        mesh.position.set(-1, 1.5, 0);
        tree.add(mesh);

        //branch
        geometry = new THREE.CylinderGeometry(0.5, 0.5, ys[i] / 2, 50);
        mesh = new THREE.Mesh(geometry, materials.get("tree trunk"));
        mesh.rotation.z = -Math.PI/4; 
        mesh.position.set(1, 2.5, 0);
        tree.add(mesh);

        //branch
        geometry = new THREE.CylinderGeometry(0.25, 0.25, ys[i] / 2, 50);
        mesh = new THREE.Mesh(geometry, materials.get("tree trunk"));
        mesh.rotation.z = Math.PI/4; 
        mesh.position.set(0.5, ys[i] / 2 + 1, 0);
        tree.add(mesh);

        //foliage
        geometry = new THREE.SphereGeometry(1.5, 32, 16);
        geometry.rotateZ(Math.PI/2);
        geometry.scale(2, 1, 1);
        mesh = new THREE.Mesh(geometry, materials.get("tree foliage"));
        mesh.position.set(-4, 2.5, 0);
        tree.add(mesh);

        //foliage
        geometry = new THREE.SphereGeometry(1.5, 32, 16);
        geometry.rotateZ(Math.PI/2);
        geometry.scale(2, 1, 1);
        mesh = new THREE.Mesh(geometry, materials.get("tree foliage"));
        mesh.position.set(1, ys[i] / 2 + 2, 0);
        tree.add(mesh);

        trees.push(tree);
    }

    for (var i = 0; i < 3; i++) {

        var tree = trees[i];
        
        var isColliding = true;
        var randomPos;

        while (isColliding) {
            randomPos = new THREE.Vector3(
                THREE.MathUtils.randFloat(spawnArea.min.x, spawnArea.max.x),
                ys[i] / 2,
                THREE.MathUtils.randFloat(spawnArea.min.z, spawnArea.max.z)
            )

            // check collision with other trees
            var isCollidingWithTrees = false;
            for (var j = 0; j < treePos.length; j++) {
                if (randomPos.distanceTo(treePos[j]) < 10) {
                    isCollidingWithTrees = true;
                    break;
                }
            }

            // check collision with house
            if (randomPos.distanceTo(housePos) > houseSize.x && 
                randomPos.distanceTo(housePos) > houseSize.z &&
                !isCollidingWithTrees) {
                isColliding = false;
            }
        }
        tree.position.copy(randomPos);
        tree.rotation.y = THREE.MathUtils.randFloat(0, Math.PI);
        scene.add(tree);

        treePos.push(randomPos);
    }
}

function createMoon(x, y, z) {
    'use strict';

    moon = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(2, 64, 32);
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
        
        var pointLight = new THREE.PointLight(0xFFFFFF, 0.2);
        pointLight.position.set(1.5, -0.5, 0);
        //const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
        //scene.add(pointLightHelper);

        mesh = new THREE.Mesh(geometry, materials.get("light"));
        mesh.rotation.x = Math.PI;
        mesh.position.set(1.5, -0.25, 0);

        pivot.add(pointLight);
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


    var spotLight = new THREE.SpotLight(0xede0c2, 0.4);
    spotLight.position.set(0, 0, 0);
    spotLight.target.position.set(0, -23.55, 0);
    // cilinder
    geometry = new THREE.CylinderGeometry(1.25, 1.25, 0.15, 50);
    mesh = new THREE.Mesh(geometry, materials.get("beam"));
    mesh.position.set(0, -0.45, 0);
    mesh.add(spotLight);
    mesh.add(spotLight.target);

    //const spotLightHelper = new THREE.PointLightHelper( spotLight, 1 );
    //scene.add(spotLightHelper);

    ovni.add(mesh);
    
    createOVNILights();

    ovni.position.set(x, y, z);
    scene.add(ovni);
}

function createWalls(x, y, z) {
    'use strict';

    // SIDE WALL
    var wall = new THREE.Group();

    var vertices = new Float32Array([
        0, 0, 14,  // 0
        3, 0, 14,  // 1
        3, 7, 14,  // 2
        0, 7, 14   // 3
    ]);
    
    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        3, 0, 14,  // 0
        5, 0, 14,  // 1
        5, 3, 14,  // 2
        0, 3, 14   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        3, 5, 14,  // 0
        5, 5, 14,  // 1
        5, 7, 14,  // 2
        0, 7, 14   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        5, 0, 14,  // 0
        8, 0, 14,  // 1
        8, 7, 14,  // 2
        5, 7, 14   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);
    
    wall.position.set(x, y, z);
    house.add(wall);

    // SIDE WALL
    var wall = new THREE.Group();

    vertices = new Float32Array([
        0, 0, 0,  // 0
        8, 0, 0,  // 1
        8, 7, 0,  // 2
        0, 7, 0   // 3
    ]);

    var indices = new Uint32Array([
        0, 2, 1,
        0, 3, 2
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);
    
    wall.position.set(x, y, z);
    house.add(wall);

    // FRONT WALL
    var wall = new THREE.Group();

    vertices = new Float32Array([
        8, 0, 0,  // 0
        8, 0, 2,  // 1
        8, 4, 2,  // 2
        8, 4, 0   // 3
    ]);

    var indices = new Uint32Array([
        0, 2, 1,
        0, 3, 2
    ]);
    
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        8, 4, 0,  // 0
        8, 4, 14,  // 1
        8, 7, 14,  // 2
        8, 7, 0   // 3
    ]);
    
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        8, 0, 4,  // 0
        8, 0, 6,  // 1
        8, 4, 6,  // 2
        8, 4, 4   // 3
    ]);
    
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        8, 0, 6,  // 0
        8, 0, 8,  // 1
        8, 2, 8,  // 2
        8, 2, 6   // 3
    ]);
    
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        8, 0, 8,  // 0
        8, 0, 10,  // 1
        8, 4, 10,  // 2
        8, 4, 8   // 3
    ]);
    
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        8, 0, 10,  // 0
        8, 0, 12,  // 1
        8, 2, 12,  // 2
        8, 2, 10   // 3
    ]);
    
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);

    vertices = new Float32Array([
        8, 0, 12,  // 0
        8, 0, 14,  // 1
        8, 4, 14,  // 2
        8, 4, 12   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);
    
    wall.position.set(x, y, z);
    house.add(wall);

    // BACK WALL
    var wall = new THREE.Group();

    vertices = new Float32Array([
        0, 0, 0,  // 0
        0, 0, 14,  // 1
        0, 7, 14,  // 2
        0, 7, 0   // 3
    ]);

    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("wall"));
    wall.add(component);
    
    wall.position.set(x, y, z);
    house.add(wall);
}

function createDoorAndWindows(x, y, z) {
    'use strict';

    // DOOR
    var deco = new THREE.Group();

    var vertices = new Float32Array([
        8, 0, 2,  // 0
        8, 0, 4,  // 1
        8, 4, 4,  // 2
        8, 4, 2   // 3
    ]);

    var indices = new Uint32Array([
        0, 2, 1,
        0, 3, 2
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("window"));
    deco.add(component);

    // WINDOWS
    vertices = new Float32Array([
        8, 2, 6,  // 0
        8, 2, 8,  // 1
        8, 4, 8,  // 2
        8, 4, 6   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("window"));
    deco.add(component);

    vertices = new Float32Array([
        8, 2, 10,  // 0
        8, 2, 12,  // 1
        8, 4, 12,  // 2
        8, 4, 10   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("window"));
    deco.add(component);

    vertices = new Float32Array([
        3, 3, 14,  // 0
        5, 3, 14,  // 1
        5, 5, 14,  // 2
        3, 5, 14   // 3
    ]);

    indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("window"));
    deco.add(component);

    deco.position.set(x, y, z);
    house.add(deco);
}

function createCeiling(x, y, z) {
    'use strict';

    var ceiling = new THREE.Group();

    var vertices = new Float32Array([
        0, 7, 0,  // 0
        0, 7, 14,  // 1
        4, 11, 14,  // 2
        4, 11, 0   // 3
    ]);

    var indices = new Uint32Array([
        0, 1, 2,
        0, 2, 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("ceiling"));
    ceiling.add(component);

    vertices = new Float32Array([
        4, 11, 0,  // 0
        4, 11, 14,  // 1
        8, 7, 14,  // 2
        8, 7, 0   // 3
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("ceiling"));
    ceiling.add(component);

    vertices = new Float32Array([
        0, 7, 0,  // 0
        4, 11, 0,  // 1
        8, 7, 0  // 2
    ]);

    indices = new Uint32Array([
        0, 1, 2,
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();
    
    var component = new THREE.Mesh(g, materials.get("ceiling"));
    ceiling.add(component);

    vertices = new Float32Array([
        0, 7, 14,  // 0
        4, 11, 14,  // 1
        8, 7, 14  // 2
    ]);

    indices = new Uint32Array([
        0, 2, 1,
    ]);

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(new THREE.BufferAttribute(indices, 1));
    g.computeVertexNormals();

    var component = new THREE.Mesh(g, materials.get("ceiling"));
    ceiling.add(component);

    ceiling.position.set(x, y, z);
    house.add(ceiling);
}

function createHouse(x, y, z) {
    'use strict';

    house = new THREE.Object3D();

    createWalls(x, y, z);

    createDoorAndWindows(x, y, z);

    createCeiling(x, y, z);

    scene.add(house);
}

///////////////////////
/*      LIGHTS       */
///////////////////////

function updateLights() {
    'use strict';
    for (let i = 3; i < 11; i++) {
    ovni.children[i].children[0].visible = !ovni.children[i].children[0].visible;
    }
}

///////////////////////
/* SHADE CALCULATION */
///////////////////////
function updateShadeCalculation() {
    'use strict';
    shadeCalculation = !shadeCalculation;
    if (!shadeCalculation) {
        whatMaterial = "basic";
        updateMaterials();
    } else {
        whatMaterial = "lambert";
        updateMaterials();
    }
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

function checkCollisions(obj, tempX, tempY, r) {
    'use strict';
    var d = ((tempX - obj.position.x) * (tempX - obj.position.x) + 
    (tempY - obj.position.y) * (tempY - obj.position.y));
    return (r >= d);
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

function handlePosition(radius, objs, obj, numObjs) {
    'use strict';
    var spawnArea = new THREE.Box3(
        new THREE.Vector3(-35, -16, 0), // Min coordinates of the spawn area
        new THREE.Vector3(35, 16, 0)    // Max coordinates of the spawn area
    );
    var tempX = THREE.MathUtils.randFloat(spawnArea.min.x, spawnArea.max.x);
    var tempY = THREE.MathUtils.randFloat(spawnArea.min.y, spawnArea.max.y);

    let j = 0;
    while(j < numObjs) {
        if (checkCollisions(objs[j], tempX, tempY, radius)) {
            tempX = THREE.MathUtils.randFloat(spawnArea.min.x, spawnArea.max.x);
            tempY = THREE.MathUtils.randFloat(spawnArea.min.y, spawnArea.max.y);
            j = 0;
        } else {
            j++;
        }
    }
    objs[numObjs] = obj;
    obj.position.set(tempX, tempY, 0);
}

////////////
/* UPDATE */
////////////
function update(delta) {
    'use strict';
    
    //updateMaterials();
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

    ovni.position.x += movementVector.x * delta * 0.1;
    ovni.position.z += movementVector.y * delta * 0.1;
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
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    renderer.xr.enabled = true;    
    document.body.appendChild(VRButton.createButton(renderer));

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
    //requestAnimationFrame(animate);
    renderer.setAnimationLoop(animate);
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
            createTerrainScene();
            break;
        case 50: // 2
            createSkyScene();
            break;
        case 51: // 3
            camera = cameras[4];
            break;
        case 52: // 4
            camera = cameras[2];
            break;
        case 53: // 5
            camera = cameras[0];
            break;
        case 54: // 6
            camera = cameras[1];
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
            ovni.children[2].children[0].visible = !ovni.children[2].children[0].visible;
            console.log("spotlight is visible: " + ovni.children[2].children[0].visible);
            break;
        case 68: // d -> luz global
            globalLight.visible = !globalLight.visible;
            console.log("global light is visible: " + globalLight.visible);
            break;
        case 81: // q -> sombreamento Gouraud
            whatMaterial = "lambert";
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