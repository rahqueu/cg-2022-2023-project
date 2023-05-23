var cameras = [], camera, scene, renderer;

var geometry;

var trailer, robot, head, feet, leg, lArm, rArm;

var minTruckAABB = new THREE.Vector3(-120 / 2 - 40, 0, -70 / 2), maxTruckAABB = new THREE.Vector3(120 / 2 - 40, 80, 70 / 2), minTrailerAABB, maxTrailerAABB;

const materials = new Map(), clock = new THREE.Clock();

const keys = {}, movementVector = new THREE.Vector2(0, 0);

// ANIMATION
const duration = 200; // duration (in milliseconds)
var time = 0;
const targetPos = new THREE.Vector3(-95, 30, 0); // final position of the trailer
let displacement;

function addEye(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(2, 2, 2); // (0.2, 0.2, 0.2)?
    var mesh = new THREE.Mesh(geometry, materials.get("eye"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntenna(obj, x, y, z) {
    'use strict';

    geometry = new THREE.ConeGeometry(2, 10, 10); // (0.2, 1)
    var mesh = new THREE.Mesh(geometry, materials.get("antenna"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 20, 30); // (2, 2, 3)
    var mesh = new THREE.Mesh(geometry, materials.get("head"));
    mesh.position.set(0, 20, 0);

    addEye(mesh, 11, 1, 5); // (x, y, z)
    addEye(mesh, 11, 1, -5); // (x, y, z)

    addAntenna(mesh, 0, 15, 5); // (x, y, z)
    addAntenna(mesh, 0, 15, -5); // (x, y, z)

    mesh.add(head);
    head.add(mesh);
    obj.add(head);
}

function addExhaustPipe(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(1, 1, 40, 15);  // (0.25, 4)
    var mesh = new THREE.Mesh(geometry, materials.get("pipe"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addForearm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 20, 20); // (4, 2, 2)
    var mesh = new THREE.Mesh(geometry, materials.get("arm"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addArm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 40, 20); // (2, 4, 2)
    var mesh = new THREE.Mesh(geometry, materials.get("arm"));
    mesh.position.set(0, 0, z);

    addExhaustPipe(mesh, x - 10, y + 15, obj.position.z > 0 ? z + 9 : z - 9); // (x, y, z)
    addForearm(mesh, x + 10, y - 30, 0);

    mesh.add(obj);
    obj.add(mesh);
    robot.add(obj);
}

function addTorso(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 40, 70); // (4, 4, 7)
    var mesh = new THREE.Mesh(geometry, materials.get("torso"));
    mesh.position.set(x + 10, y, z);
    obj.add(mesh);

    geometry = new THREE.CubeGeometry(20, 40, 30); // (4, 4, 7)
    var mesh = new THREE.Mesh(geometry, materials.get("torso"));
    mesh.position.set(x - 10, y, z);
    obj.add(mesh);
}

function addAbdomen(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 20, 30); // (4, 2, 2)
    var mesh = new THREE.Mesh(geometry, materials.get("abdomen"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(7.5, 7.5, 10, 15);  // (0.75, 1)
    var mesh = new THREE.Mesh(geometry, materials.get("wheel"));
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWaist(obj, x, y, z) {
    'use strict';

    addWheel(obj, x, y - 7.5, z - 40); // (x, y, z)
    addWheel(obj, x, y - 7.5, z + 40); // (x, y, z)

    geometry = new THREE.CubeGeometry(40, 20, 70); // (4, 2, 7)
    var mesh = new THREE.Mesh(geometry, materials.get("waist"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFoot(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 10, 30); // (2, 1, 3)
    var mesh = new THREE.Mesh(geometry, materials.get("foot"));
    mesh.position.set(0, -5, z < 0 ? z-5 : z+5);
    mesh.add(feet);
    feet.add(mesh);
    leg.add(feet);
}

function addLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(10, 70, 30); // (1, 7, 3)
    var mesh = new THREE.Mesh(geometry, materials.get("leg"));
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addThigh(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(10, 30, 20); // (1, 3, 2)
    var mesh = new THREE.Mesh(geometry, materials.get("thigh"));
    mesh.position.set(0, -10, z);

    addLeg(mesh, 0, -50, z < 0 ? -5 : 5); // (x, y, z)
    addWheel(mesh, 2.5, -55, z < 0 ? -25 : 25); // (x, y, z)
    addWheel(mesh, 2.5, -75, z < 0 ? -25 : 25); // (x, y, z)
    addFoot(mesh, 5, -90, z); // (x, y, z)

    mesh.add(leg);
    leg.add(mesh);
    obj.add(leg);
}

function createRobot(x, y, z) {
    'use strict';

    robot = new THREE.Object3D();
    robot.userData = {truck: false};

    addWaist(robot, 0, 0, 0); // (x, y, z)
    addAbdomen(robot, 0, 20, 0); // (x, y, z)
    addTorso(robot, 0, 50, 0); // (x, y, z)

    // head
    head = new THREE.Group();
    head.position.set(10, 60, 0);

    addHead(robot, 0, 20, 0); // (x, y, z)

    // arms
    lArm = new THREE.Group();
    lArm.position.set(-10, 50, 45);

    rArm = new THREE.Group();
    rArm.position.set(-10, 50, -45);

    addArm(lArm, 0, 0, 0); // (x, y, z)
    addArm(rArm, 0, 0, 0); // (x, y, z)

    // legs
    leg = new THREE.Group();
    leg.position.set(5, -5, 0);

    // feet
    feet = new THREE.Group();
    feet.position.set(5, -95, 0);

    addThigh(robot, 0, 0, 15); // (x, y, z)
    addThigh(robot, 0, 0, -15); // (x, y, z)

    scene.add(robot);

    robot.position.set(x, y, z);
}

function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();
    trailer.userData = {engaging: false, engaged:false, displacement: new THREE.Vector3(0, 0, 0)};

    geometry = new THREE.CubeGeometry(150, 80, 70); // (5, 5, 15)
    var mesh = new THREE.Mesh(geometry, materials.get("trailer"));
    mesh.position.set(0, 25, 0);
    trailer.add(mesh);

    geometry = new THREE.CubeGeometry(50, 10, 70); // (5, 5, 15)
    var mesh = new THREE.Mesh(geometry, materials.get("trailer"));
    mesh.position.set(-40, -20, 0);
    trailer.add(mesh);

    addWheel(trailer, -60, -22.5, -40); // (x, y, z)
    addWheel(trailer, -20, -22.5, -40); // (x, y, z)
    addWheel(trailer, -60, -22.5, 40); // (x, y, z)
    addWheel(trailer, -20, -22.5, 40); // (x, y, z)

    scene.add(trailer);

    trailer.position.set(x, y, z);
    updateTrailerAABB();
}

function updateMovement() {
    'use strict';
    movementVector.set(0, 0);

    if (keys['ArrowUp']) {
        movementVector.x -= 1;
    }
    if (keys['ArrowDown']) {
        movementVector.x += 1;
    }
    if (keys['ArrowLeft']) {
        movementVector.y += 1;
    }
    if (keys['ArrowRight']) {
        movementVector.y -= 1;
    }

    movementVector.normalize();
}

function updateTruckPosition() {
    'use strict';

    const tentativeX = trailer.position.x + movementVector.x * 2.5;
    const tentativeZ = trailer.position.z + movementVector.y * 2.5;

    return new THREE.Vector2(tentativeX, tentativeZ);
}

function updateTrailerAABB(x, z) {
    'use strict';
    
    // 150, 90, 70
    minTrailerAABB = new THREE.Vector3(x - 150 / 2, trailer.position.y - 90 / 2 + 15, z - 70 / 2);
    maxTrailerAABB = new THREE.Vector3(x + 150 / 2, trailer.position.y + 90 / 2 + 15, z + 70 / 2);
}

function computeDisplacement() {
    if (!trailer.userData.engaging) {
        const currPos = trailer.position.clone();
        const mx = (targetPos.x - currPos.x) / duration;
        const my = (targetPos.y - currPos.y) / duration;
        const mz = (targetPos.z - currPos.z) / duration;
        displacement = new THREE.Vector3(mx, my, mz);
    }
}

function checkCollision(pos) {
    'use strict';

    updateTrailerAABB(pos.x, pos.y);

    var newPos = pos;

    if (maxTruckAABB.x > minTrailerAABB.x && minTruckAABB.x < maxTrailerAABB.x &&
        maxTruckAABB.y > minTrailerAABB.y && minTruckAABB.y < maxTrailerAABB.y &&
        maxTruckAABB.z > minTrailerAABB.z && minTruckAABB.z < maxTrailerAABB.z) 
    {   
        if (!trailer.userData.engaged) { // collision detected and trailer is not engaged -> engage (animation)
            computeDisplacement();
            trailer.userData.engaging = true;
            newPos.x = trailer.position.x;
            newPos.y = trailer.position.z;
        }
    } else {
        trailer.userData.engaged = false;
    }

    return newPos;
}  

function checkTruckMode() {
    'use strict';

    robot.userData.truck = head.rotation.z == Math.PI / 2 &&
                            leg.rotation.z ==  - Math.PI / 2 &&
                            feet.rotation.z == - Math.PI / 2 &&
                            lArm.position.z == 25 && rArm.position.z == -25;
}

function rotateHead(d) {
    'use strict';

    if (head.rotation.z > 0 && d > 0){
        head.rotation.z -= Math.PI / 8;
    } else if (head.rotation.z < Math.PI / 2 && d < 0) {
        head.rotation.z += Math.PI / 8;
    }
    checkTruckMode();
}

function rotateLegs(d) {
    'use strict';

    if (leg.rotation.z < 0 && d > 0){
        leg.rotation.z += Math.PI / 8;
    } else if (leg.rotation.z > - Math.PI / 2 && d < 0) {
        leg.rotation.z -= Math.PI / 8;
    }
    checkTruckMode();
}

function rotateFeet(d) {
    'use strict';

    if (feet.rotation.z < 0 && d > 0){
        feet.rotation.z += Math.PI / 8;
    } else if (feet.rotation.z > - Math.PI / 2 && d < 0) {
        feet.rotation.z -= Math.PI / 8;
    }
    checkTruckMode();
}

function displaceArms(d) {
    'use strict';

    if (lArm.position.z < 45 && d > 0) {
        lArm.position.z += 5;
        rArm.position.z -= 5;
    } else if (lArm.position.z > 25 && d < 0) {
        lArm.position.z -= 5;
        rArm.position.z += 5;
    }
    checkTruckMode();
}

function createMaterials() {
    'use strict';
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
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color('#ffffff')
    scene.add(new THREE.AxisHelper(150));

    createRobot(0, 15, 0);
    createTrailer(0, 30, -150);
}

function createCameras() {
    'use strict';
    const positions = new Array(new Array(50, 0, 0), // frontal
                                new Array(0, 0, 50), // lateral
                                new Array(0, 150, 0), // topo
                                new Array(150, 150, 150), // perspetiva isométrica - projeção ortogonal
                                new Array(150, 150, -150)); // perspetiva isométrica - projeção perspetiva

    for (let i = 0; i < 5; i++) {
        camera = new THREE.OrthographicCamera(window.innerWidth / -5,
                                            window.innerWidth / 5,
                                            window.innerHeight / 5,
                                            window.innerHeight / -5,
                                            1,
                                            1000);
        camera.position.set(positions[i][0], positions[i][1], positions[i][2]);
        camera.lookAt(scene.position);
        cameras.push(camera);
    }

    // to better observer movement
    camera = new THREE.PerspectiveCamera(70,
                                        window.innerWidth / window.innerHeight,
                                        1,
                                        1000);
    camera.position.x = 250;
    camera.position.y = 250;
    camera.position.z = 250;
    camera.lookAt(scene.position);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    } 

}

function onKeyDown(e) {
    'use strict';

    if (!trailer.userData.engaging)
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
    case 81: // q
        if (!trailer.userData.engaging) rotateFeet(1);
        break;
    case 65: // a
        if (!trailer.userData.engaging) rotateFeet(-1);
        break;
    case 87: // w
        if (!trailer.userData.engaging) rotateLegs(1);
        break;
    case 83: // s
        if (!trailer.userData.engaging) rotateLegs(-1);
        break;
    case 69: //e
        if (!trailer.userData.engaging) displaceArms(1);
        break;
    case 68: // d
        if (!trailer.userData.engaging) displaceArms(-1);
        break;
    case 82: // r
        if (!trailer.userData.engaging) rotateHead(1);
        break;
    case 70: // f
        if (!trailer.userData.engaging) rotateHead(-1);
        break;
    case 54: // 6
        materials.forEach(value => {value.wireframe = !value.wireframe});
        break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

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
    window.addEventListener("resize", onResize);

    // handle movement
    window.addEventListener("keydown", (e) => {
        if (!trailer.userData.engaging) keys[e.code] = true;
        updateMovement();
    });
    window.addEventListener("keyup", (e) => {
        keys[e.code] = false;
        updateMovement();
    });
}

function animate() {
    'use strict';
    
    if (!trailer.userData.engaging) { // trailer is free to move around
        var tentativePos = updateTruckPosition();
        var currentPos;
        
        if (robot.userData.truck) { // check collision (truck mode && trailer not engaged)
            currentPos = checkCollision(tentativePos);
        } else {
            currentPos = tentativePos;
        }
        trailer.position.x = currentPos.x;
        trailer.position.z = currentPos.y;
        updateTrailerAABB(trailer.position.x, trailer.position.z);
    } else if (time < duration) { // collision detected -> animation
        trailer.position.add(displacement);
        time++;
    } else { // end of animation, trailer/robot free to move
        trailer.position.set(-95, 30, 0);
        trailer.userData.engaging = false;
        trailer.userData.engaged = true;
        time = 0;
    }

    render();
    requestAnimationFrame(animate);
    
}