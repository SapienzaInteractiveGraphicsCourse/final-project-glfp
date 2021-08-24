import { getBody } from './JS/modelLoader.js';

					
var treePositions = [[-10, -10], [-10, -20], [-10, -45], [-25, -15], [-20, -40], [-35, -20], [-35, -30], [-45, -20], [-45, -30], [-40, -40], [-25, -45], [-35, -45], [-45, -40],
				 [ 10, -10], [ 10, -20], [ 10, -45], [ 25, -15], [ 20, -40], [ 35, -20], [ 35, -30], [ 45, -20], [ 45, -30], [ 40, -40], [ 25, -45], [ 35, -45], [45, -40],
				 [-10,  10], [-10,  20], [-10,  45], [-25,  15], [-20,  40], [-35,  20], [-35,  30], [-45,  20], [-45,  30], [-40,  40], [-25,  45], [-35,  45], [-45,  40],
				 [ 10,  10], [ 10,  20], [ 10,  45], [ 25,  15], [ 20,  40], [ 35,  20], [ 35,  30], [ 45,  20], [ 45,  30], [ 40,  40], [ 25,  45], [ 35,  45], [45, 40],
				 [  0,  10], [  0,  25], [  0,  35], [  0,  45], [  0, -10], [  0, -25], [  0, -35], [  0, -45]
				 [ 15,   0], [ 30,   0], [ 35,   0], [ 45,   0], [-15,   0], [-30,   0], [-35,   0], [-45,   0]
				 ];
				 
var hedgePositions = [[50, 50], [45, 50], [40, 50], [35, 50], [30, 50], [25, 50], [20, 50], [15, 50], [10, 50], [5, 50], [0, 50],
					  [-50, 50], [-45, 50], [-40, 50], [-35, 50], [-30, 50], [-25, 50], [-20, 50], [-15, 50], [-10, 50], [-5, 50],
					  
					  [45, -50], [40, -50], [35, -50], [30, -50], [25, -50], [20, -50], [15, -50], [10, -50], [5, -50], [0, -50],
					  [-45, -50], [-40, -50], [-35, -50], [-30, -50], [-25, -50], [-20, -50], [-15, -50], [-10, -50], [-5, -50],
					  
					  [50, 44], [50, 38], [50, 32], [50, 26], [50, 20], [50, 14], [50, 8], [50, 2], [50, -4], [50, -10], [50, -16], [50, -22],
					  [50, -28], [50, -34], [50, -40], [50, -46],
					  
					  [-50, 44], [-50, 38], [-50, 32], [-50, 26], [-50, 20], [-50, 14], [-50, 8], [-50, 2], [-50, -4], [-50, -10], [-50, -16], [-50, -22],
					  [-50, -28], [-50, -34], [-50, -40], [-50, -46],
					  ];			


var objectPositions = [	[-15, -10],[-20, -20],[-10, -40],[-30, -40],[-40, -30],
						[-15, 10],[-20, 20],[-10, 40],[-30, 40],[-40, 30],
						[15, -10],[20, -20],[10, -40],[30, -40],[40, -30],
						[15, 10],[20, 20],[10, 40],[30, 40],[40, 30],
					  ]

				 
var pineMesh1, pineMesh2, pineMesh3;
var hedgeMesh;
var treeDims, hedgeDims;
var scene, world;
var playerMesh;
var fuelMesh, keyMesh, wrenchMesh;

export default function buildEnvironment(values){
	scene = values.scene;
	world = values.world;
	let camera = values.camera;
	let spotLightTorch = values.spotLightTorch;
	let spotLightCar = values.spotLightCar;
	let models = values.models;
	
	models.forEach(model =>{
		if (model.myType !== 'pine' && model.myType !== 'hedge'){
			scene.add(model);
			if (typeof model.body !== 'undefined')
				world.add(model.body);
		}
	});
	
	let groundMesh = models[0];
	playerMesh = models[1];
	playerMesh.add(camera);
	
	
	let tendMesh = models[12];
	let scarecrowMesh = models[13];
	let woodaxeMesh = models[14];
	let gateMesh = models[16];
	let bridgeMesh = models[5];
	let carMesh = models[6];
	fuelMesh = models[8];
	keyMesh = models[9];
	wrenchMesh = models[10];
	
	spotLightCar.position.set(0 , 1, 3);
	spotLightCar.target = carMesh.getObjectByName("mesh_14");
	
	carMesh.getObjectByName("mesh_14").rotation.y = Math.PI;
	carMesh.getObjectByName("mesh_14").position.z = 2.85;

	carMesh.getObjectByName("mesh_14").add(spotLightCar);


	let materialGround = new CANNON.ContactMaterial(groundMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialGround);
	
	let materialBridge = new CANNON.ContactMaterial(bridgeMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialBridge);

	let materialCar = new CANNON.ContactMaterial(groundMesh.material, carMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialCar);

	let materialCarPlayer = new CANNON.ContactMaterial(carMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialCarPlayer);
	
	let materialTend = new CANNON.ContactMaterial(tendMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialTend);
	
	let materialscarecrow = new CANNON.ContactMaterial(scarecrowMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialscarecrow);
	
	let materialwoodaxe = new CANNON.ContactMaterial(woodaxeMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialwoodaxe);

	let materialgate = new CANNON.ContactMaterial(gateMesh.material, playerMesh.material, {friction: 0, restitution: 0});
	world.addContactMaterial(materialgate);

	pineMesh1 = models[2];
	pineMesh2 = models[3];
	pineMesh3 = models[4];
	treeDims = new THREE.Box3().setFromObject(pineMesh2.getObjectByName("mesh_1"));
	treeDims.max.z = treeDims.max.z/1.6; 
	treeDims.min.z = treeDims.min.z/1.6;
 	treeDims.max.x = treeDims.max.x/1.6; 
	treeDims.min.x = treeDims.min.x/1.6; 
	

	hedgeMesh = models[17];
	hedgeDims = new THREE.Box3().setFromObject(hedgeMesh);
	
	let torchMesh = models[7];
	spotLightTorch.position.set(0 , -0.1, 0);
	spotLightTorch.target = torchMesh;	
	
	//setTimeout(function(){ spawnTrees(); }, 1);
	//setTimeout(function(){ spawnHedges(); }, 1);
	spawnTrees()
	spawnHedges()
	let tmp = (localStorage.getItem('objectSpawn') === 'true');
	if(!tmp)
		spawnRandomObjects();
	//spawnTrees();
}


function spawnTrees(){
	let x, z, rand;
	let tree, body;
	for(let i = 0; i < treePositions.length; i++){
		x = treePositions[i][0];
		z = treePositions[i][1];
		
		rand = Math.floor(Math.random() * 3);

		switch(rand){
			case 0:
				tree = pineMesh1.clone();
				break;
			case 1:
				tree = pineMesh2.clone();

				break;
			case 2:
				tree = pineMesh3.clone();
				break;
		}
		tree.position.x = x;
		tree.position.z = z;
	
		let tmp = getBody(tree, 0, treeDims)
	
		world.add(tmp[0])
		if(rand == 0)
			tree.position.y +=1.5;
			
		let material = new CANNON.ContactMaterial(tmp[1], playerMesh.material, {friction: 0, restitution: 0});
		world.addContactMaterial(material);
		
		scene.add(tree);
		
	}
}

function spawnHedges(){
	let x, z;
	let hedge, body;
	for(let i = 0; i < hedgePositions.length; i++){
		x = hedgePositions[i][0];
		z = hedgePositions[i][1];
		
		hedge = hedgeMesh.clone();
			
		hedge.position.x = x;
		hedge.position.z = z;
	
		let tmp = getBody(hedge, 0, hedgeDims)

	
		world.add(tmp[0])
		
		let material = new CANNON.ContactMaterial(tmp[1], playerMesh.material, {friction: 0, restitution: 0});
		world.addContactMaterial(material);
		
		scene.add(hedge);
		
	}
}

function spawnRandomObjects(){
	objectPositions;
	let tmpArray2 = [];
	
	for(let i = 0; i < 3; i++){
		tmpArray2.push(objectPositions.splice(Math.floor(Math.random()*objectPositions.length), 1));
	}
	fuelMesh.position.x = tmpArray2[0][0][0];
	fuelMesh.position.z = tmpArray2[0][0][1]; 
	keyMesh.position.x = tmpArray2[1][0][0]; 
	keyMesh.position.z = tmpArray2[1][0][1]; 
	wrenchMesh.position.x = tmpArray2[2][0][0]; 
	wrenchMesh.position.z = tmpArray2[2][0][1]; 
}
