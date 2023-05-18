var cameras = [], camera, scene, renderer;

var material, materials = new Map();

var geometry, mesh;

var trailer;

const keys = {}, movementVector = new THREE.Vector2();

function addEye(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(2, 2, 2); // (0.2, 0.2, 0.2)?
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntenna(obj, x, y, z) {
    'use strict';

    geometry = new THREE.ConeGeometry(2, 10, 10); // (0.2, 1)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';

    var head = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(20, 20, 30); // (2, 2, 3)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    head.add(mesh);

    addEye(head, x + 11, y + 1, z + 5); // (x, y, z)
    addEye(head, x + 11, y + 1, z - 5); // (x, y, z)

    addAntenna(head, x, y + 15, z + 5); // (x, y, z)
    addAntenna(head, x, y + 15, z - 5); // (x, y, z)

    obj.add(head);

}

function addExhaustPipe(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(0.25, 0.25, 40, 15);  // (0.25, 4)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addForearm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 20, 20); // (4, 2, 2)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addArm(obj, x, y, z) {
    'use strict';

    var arm = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(20, 40, 20); // (2, 4, 2)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    arm.add(mesh)

    addForearm(arm, x + 10, y - 30, z);

    obj.add(arm);
}

function addTorso(obj, x, y, z) {
    'use strict';

    addExhaustPipe(obj, x - 19.75, y + 15, z + 35); // (x, y, z)
    addExhaustPipe(obj, x - 19.75, y + 15, z - 35); // (x, y, z)

    geometry = new THREE.CubeGeometry(40, 40, 70); // (4, 4, 7)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAbdomen(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 20, 20); // (4, 2, 2)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, m, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(7.5, 7.5, 10, 15);  // (0.75, 1)
    mesh = new THREE.Mesh(geometry, m);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWaist(obj, x, y, z) {
    'use strict';

    addWheel(obj, x, y - 7.5, z - 40); // (x, y, z)
    addWheel(obj, x, y - 7.5, z + 40); // (x, y, z)

    geometry = new THREE.CubeGeometry(40, 20, 70); // (4, 2, 7)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFoot(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 10, 30); // (2, 1, 3)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z < 0 ? z - 5 : z + 5);
    obj.add(mesh);
}

function addLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(10, 70, 30); // (1, 7, 3)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addThigh(obj, x, y, z) {
    'use strict';

    var leg = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(10, 30, 20); // (1, 3, 2)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    leg.add(mesh);

    addLeg(leg, x, y - 50, z < 0 ? z - 5 : z + 5); // (x, y, z)
    addWheel(leg, x, y - 55, z < 0 ? z - 25 : z + 25); // (x, y, z)
    addWheel(leg, x, y - 75, z < 0 ? z - 25 : z + 25); // (x, y, z)
    addFoot(leg, x + 5, y - 90, z); // (x, y, z)

    obj.add(leg);
}

function createRobot(x, y, z) {
    'use strict';

    var robot = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    addWaist(robot, 0, 0, 0); // (x, y, z)
    addAbdomen(robot, 0, 20, 0); // (x, y, z)
    addTorso(robot, 0, 50, 0); // (x, y, z)

    addHead(robot, 10, 80, 0); // (x, y, z)
    
    addArm(robot, 10, 50, 45); // (x, y, z)
    addArm(robot, 10, 50, -45); // (x, y, z)

    addThigh(robot, 5, -15, 15); // (x, y, z)
    addThigh(robot, 5, -15, -15); // (x, y, z)

    scene.add(robot);

    robot.position.set(x, y, z);
}

function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();
    trailer.userData = {moving: false};

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    geometry = new THREE.CubeGeometry(150, 50, 50); // (5, 5, 15)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    trailer.add(mesh);

    geometry = new THREE.CubeGeometry(20, 5, 5); // (5, 5, 15)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x + 75, y - 15, z);
    trailer.add(mesh);

    var wheel_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addWheel(trailer, wheel_mat, x - 60, y - 25, z - 20); // (x, y, z)
    addWheel(trailer, wheel_mat, x - 40, y - 25, z - 20); // (x, y, z)
    addWheel(trailer, wheel_mat, x - 60, y - 25, z + 20); // (x, y, z)
    addWheel(trailer, wheel_mat, x - 40, y - 25, z + 20); // (x, y, z)

    scene.add(trailer);
}

function updateMovementVector() {
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

    console.log(movementVector);

    movementVector.normalize();
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color('#ffffff')
    scene.add(new THREE.AxisHelper(150));

    createRobot(0, 0, 0);
    //createTrailer(0, 0, 0);
}

function createCameras() {
    'use strict';
    const positions = new Array(new Array(50, 0, 0), // frontal
                                new Array(0, 0, 50), // lateral
                                new Array(0, 50, 0), // topo
                                new Array(50, 50, 50), // perspetiva isométrica - projeção ortogonal
                                new Array(50, 50, -50)); // perspetiva isométrica - projeção perspetiva

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

    createScene();
    createCameras();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    // handle movement
    window.addEventListener("keydown", (e) => {
        keys[e.code] = true;
        updateMovementVector();
    });
    window.addEventListener("keyup", (e) => {
        keys[e.code] = false;
        updateMovementVector();
    });
}

function animate() {
    'use strict';

    if (trailer) {
        trailer.position.x += movementVector.x * 5;
        trailer.position.z += movementVector.y * 5;
    }

    render();
    requestAnimationFrame(animate);
    
}