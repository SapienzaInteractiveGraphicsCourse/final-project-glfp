import { GLTFLoader  } from 'https://cdn.skypack.dev/three@0.131.2/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();


export async function loadModel(){
	var models = [];
	
	
	// 0 - load ground
	
	let groundMesh = await getModel("../../Models/Ground1/scene.gltf", 100, 0, 0.33, 0);
	let groundShape = new CANNON.Plane();
	let groundMaterial = new CANNON.Material();
	groundMesh.body =  new CANNON.Body({ mass: 0, material: groundMaterial });
	groundMesh.body.addShape(groundShape);
	groundMesh.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
	//groundMesh.shape = groundShape;
	groundMesh.material = groundMaterial;
	groundMesh.castShadow = true;
	groundMesh.receiveShadow = true;

	groundMesh.traverse( function(child) {

		if (child.isMesh) {
			groundMesh.castShadow = true;
			groundMesh.receiveShadow = true;
		}
	});
		
	//////////////////////////////////////////////////
	
	// 1 - load player
	let playerMesh = await getModel("../../Models/Woody/scene.gltf", 0.15, 0, 5, 0);
	playerMesh.getObjectByName("mixamorigLeftArm_09").rotation.x = Math.PI/4;
	playerMesh.getObjectByName("mixamorigLeftForeArm_010").rotation.x = Math.PI/8;
	playerMesh.getObjectByName("mixamorigRightArm_033").rotation.x = Math.PI/4;
	playerMesh.getObjectByName("mixamorigRightForeArm_034").rotation.x = Math.PI/8;
	let dims = new THREE.Box3().setFromObject(playerMesh);
	//dims.max.z = dims.max.z/2; 
	//dims.min.z = dims.min.z/2; 
	let tmp = getBodyPlayer(playerMesh, 20, dims)
	playerMesh.body = tmp[0];
	playerMesh.material	= tmp[1];
	playerMesh.plDimY = (dims.max.y-dims.min.y)/2.0;
	playerMesh.castShadow = true;	
	
	//////////////////////////////////////////////////
	
	// 2 - load pine1
	let pineMesh1 = await getModel("../../Models/Pine/Pine1/scene.gltf", 60, 10, 0, 10);
	pineMesh1.castShadow = true;
	pineMesh1.myType = 'pine';

	// 3 - load pine1
	let pineMesh2 = await getModel("../../Models/Pine/Pine2/scene.gltf", 1, -10, 0, -10);
	pineMesh2.castShadow = true;
	pineMesh2.myType = 'pine';

	// 4 - load pine1
	let pineMesh3 = await getModel("../../Models/Pine/Pine3/scene.gltf", 60, 10, 0, -10);
	pineMesh3.castShadow = true;
	pineMesh3.myType = 'pine';


	//////////////////////////////////////////////////
	
	// 5 - load bridge
	let bridgeMesh = await getModel("../../Models/Bridge/scene.gltf", 1, 20, 0, 0);
	dims = new THREE.Box3().setFromObject(bridgeMesh);
	tmp = getBody(bridgeMesh, 0, dims)
	bridgeMesh.body = tmp[0];
	bridgeMesh.material	= tmp[1];	
	bridgeMesh.castShadow = true;
	
	//////////////////////////////////////////////////

	// 6 - load car
	let carMesh = await getModel("../../Models/Quad/scene.gltf", 0.5, -40, 0, -25);
	dims = new THREE.Box3().setFromObject(carMesh);
	tmp = getBody(carMesh, 0, dims)
	carMesh.body = tmp[0];
	carMesh.body.type = CANNON.Body.DYNAMIC;
	carMesh.material = tmp[1];
	carMesh.castShadow = true;
	
	//////////////////////////////////////////////////

	// 7 - load torch
	var torchMesh = await getModel("../../Models/Torch/scene.gltf", 10	, 0, 0, 0);
	torchMesh.castShadow = true;
	torchMesh.rotation.z = -Math.PI/2;
	torchMesh.groundScale = torchMesh.scale;
	torchMesh.handScale = torchMesh.scale/0.05;

	//////////////////////////////////////////////////

	// 8 - load fuel
	var fuelMesh = await getModel("../../Models/Fuel/scene.gltf", 1, -40, 0.5, -10);
	fuelMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 9 - load key
	var keyMesh = await getModel("../../Models/Keys/scene.gltf", 1, 35, 0.5, 35);
	keyMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 10 - load wrench
	var wrenchMesh = await getModel("../../Models/Wrench/scene.gltf", 10, 25, 0.5, -40);
	wrenchMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 11 - load bonfire
	var bonfireMesh = await getModel("../../Models/Bonfire/scene.gltf", 2, -25, 0, -30);
	const bonfireMaterial = new THREE.MeshPhongMaterial();
	bonfireMaterial.emissive = new THREE.Color( 0xff0000 );
	bonfireMaterial.emissiveIntensity = 100;
	bonfireMesh.material = bonfireMaterial;
	bonfireMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 12 - load tend
	var tendMesh = await getModel("../../Models/Tend/scene.gltf", 0.5, -20, 0.1, -25);
	dims = new THREE.Box3().setFromObject(tendMesh);
	dims.max.z = dims.max.z/1.8; 
	dims.min.z = dims.min.z/1.8;
 	dims.max.x = dims.max.x/1.8; 
	dims.min.x = dims.min.x/1.8; 
	tmp = getBody(tendMesh, 0, dims)
	tendMesh.body = tmp[0];
	tendMesh.material = tmp[1];	
	tendMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 13 - load scarecrow
	var scarecrowMesh = await getModel("../../Models/Scarecrow/scene.gltf", 4, -28, 0.1, -27);
	dims = new THREE.Box3().setFromObject(scarecrowMesh);
	dims.max.z = dims.max.z/1.8; 
	dims.min.z = dims.min.z/1.8;
 	dims.max.x = dims.max.x/1.8; 
	dims.min.x = dims.min.x/1.8; 
	tmp = getBody(scarecrowMesh, 0, dims)
	scarecrowMesh.body = tmp[0];
	scarecrowMesh.material = tmp[1];
	scarecrowMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 14 - load woodaxe
	var woodaxeMesh = await getModel("../../Models/Woodaxe/scene.gltf", 300, -25, 0.1, -22);
	dims = new THREE.Box3().setFromObject(woodaxeMesh);
	dims.max.z = dims.max.z/1.8; 
	dims.min.z = dims.min.z/1.8;
 	dims.max.x = dims.max.x/1.8; 
	dims.min.x = dims.min.x/1.8; 
	tmp = getBody(woodaxeMesh, 0, dims)
	woodaxeMesh.body = tmp[0];
	woodaxeMesh.material = tmp[1];
	woodaxeMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 15 - load night Skybox
	var nightMesh = await getModel("../../Models/Skyboxes/Night/scene.gltf", 1, 0, 0, 0);

	//////////////////////////////////////////////////

	// 15 - load day Skybox
	var dayMesh = await getModel("../../Models/Skyboxes/Day/scene.gltf", 0.5, 0, 0, 0);

	//////////////////////////////////////////////////
	
	// 15 - load sunset Skybox
	var sunsetMesh = await getModel("../../Models/Skyboxes/Sunset/scene.gltf", 0.5, 0, 0, 0);

	//////////////////////////////////////////////////

	// 16 - load gate
	var gateMesh = await getModel("../../Models/Gate/scene.gltf", 0.5, 30, -1, 45);
	dims = new THREE.Box3().setFromObject(gateMesh);
	tmp = getBody(gateMesh, 0, dims)
	gateMesh.body = tmp[0];
	gateMesh.material = tmp[1];
	gateMesh.castShadow = true;

	//////////////////////////////////////////////////

	// 17 - load hedge
	var hedgeMesh = await getModel("../../Models/Hedge/scene.gltf", 20, 48, 0, 50);
	hedgeMesh.myType = 'hedge';

	//////////////////////////////////////////////////

	
	models.push(groundMesh);
	models.push(playerMesh);
	models.push(pineMesh1);
	models.push(pineMesh2);
	models.push(pineMesh3);
	models.push(bridgeMesh);
	models.push(carMesh);
	models.push(torchMesh);
	models.push(fuelMesh);
	models.push(keyMesh);
	models.push(wrenchMesh);
	models.push(bonfireMesh);
	models.push(tendMesh);
	models.push(scarecrowMesh);
	models.push(woodaxeMesh);
	
	tmp = localStorage.getItem('ambientLight');
	
	if(tmp == "0xfdfbd3"){
		models.push(dayMesh);
	}else if(tmp == "0x222222"){
		models.push(sunsetMesh);
	}else{
		models.push(nightMesh);
	}
	
	models.push(gateMesh);
	models.push(hedgeMesh);

	return models;
}

function modelLoader(url){
	return new Promise((resolve, reject) => {
		loader.load(url, data=> resolve(data), null, reject);
	});
}

async function getModel(url, scale, x, y, z){
	let gltfData = await modelLoader(url);
	let mesh = gltfData.scene;
	mesh.scale.multiplyScalar(1 / scale); // adjust scalar factor to match your scene scale
	mesh.position.x = x; // once rescaled, position the model where needed
	mesh.position.y = y;
	mesh.position.z = z;
	mesh.updateMatrixWorld()
	return mesh;
}


function getBodyPlayer(mesh, mass, dims){
	let dimX = (dims.max.x-dims.min.x)/2.0;
	let dimY = (dims.max.y-dims.min.y)/2.0;
	let dimZ = (dims.max.z-dims.min.z)/2.0;

	let shape = new CANNON.Sphere(0.9);
	let material = new CANNON.Material();
	let body = new CANNON.Body({ mass: mass, material:material});

	body.addShape(shape);
	body.position.x = mesh.position.x;
	body.position.y = mesh.position.y+1;
	body.position.z = mesh.position.z;
	
	return [body, material];
}



export function getBody(mesh, mass, dims){
	let dimX = (dims.max.x-dims.min.x)/2.0;
	let dimY = (dims.max.y-dims.min.y)/2.0;
	let dimZ = (dims.max.z-dims.min.z)/2.0;

	let shape = new CANNON.Box(new CANNON.Vec3(dimX, dimY, dimZ));
	let material = new CANNON.Material();
	let body = new CANNON.Body({ mass: mass, material:material});

	body.addShape(shape);
	body.position.x = mesh.position.x;
	body.position.y = mesh.position.y+dimY;
	body.position.z = mesh.position.z;
	
	return [body, material];
}

export default { loadModel, getBody };