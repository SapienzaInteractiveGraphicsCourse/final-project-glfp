import { GLTFLoader  } from 'https://cdn.skypack.dev/three@0.131.2/examples/jsm/loaders/GLTFLoader.js';
import { Clock  } from 'https://cdn.skypack.dev/three@0.131.2/src/core/Clock.js';

import { loadModel } from './modelLoader.js';
import buildEnvironment from './environmentBuilder.js';
import animationsLoader from './animationsLoader.js';
import {restingPosition, setPositionGrabTorch, setPositionDropTorch, jumpPosition, setPosition, setPositionCar, checkDistance } from './support.js'
import { getBody } from './modelLoader.js';

var game = async function(){
	
//*****************
//  variable      *
//*****************

	//get settings
	var ambientLightDiff = Number(localStorage.getItem('ambientLight'));
	var objectSpawnDiff = localStorage.getItem('objectSpawn');
	var fpCamera = (localStorage.getItem('camera') === 'true');
	var lockCamera =  (localStorage.getItem('lockCamera') === 'true');
	var shadowBox =  (localStorage.getItem('shadowBox') === 'true');
	
	var keyA, keyD, keyS, keyW, keySpace;
	var keyRightArrow, keyLeftArrow, keyUpArrow, keyDownArrow;

	var width = window.innerWidth;
	var height = window.innerHeight;
	var scene = new THREE.Scene();

	// camera settings
	var viewAngle = 55;
	var nearClipping = 0.1;
	var farClipping = 50000;
	var camera = new THREE.PerspectiveCamera( viewAngle, width / height, nearClipping, farClipping );
	var fpCameraPosition = new THREE.Vector3(0, 0.4, -0.00001);
	var tpCameraPosition = new THREE.Vector3(0, 0.8, -1);
	var carCameraPosition = new THREE.Vector3(0, 4, -5);

	var cameraEuler = new THREE.Euler(0, 0, 0, 'YXZ');
	var cameraSpeed = Math.PI / 540;
	var cameraSpeed2= Math.PI / 10;
	
	camera.lookAt(scene.position);
	camera.rotation.z = Math.PI;
	camera.rotation.x = -Math.PI/1.17;
	
	
	//renderer settings
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height );
	renderer.outputEncoding = THREE.sRGBEncoding;
	if(shadowBox)
		renderer.shadowMap.enabled = true;
		
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	
	document.body.appendChild(renderer.domElement);
	
	const loader = new GLTFLoader();

	// cannon world settings
	const world = new CANNON.World();
	world.gravity.set(0, -9.82, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	
	var divTorchLight = document.getElementById('divTorchLight');	
	var divCarLight = document.getElementById('divCarLight');	

	var playerMesh;
	var ambientMesh;
	var canWalk = true;
	var canJump = false;
	
	var torchToPlayerPos = new THREE.Vector3(-15, 11, 5);
	var distancePlayerTorch;
	var distancePlayerKey;
	var distancePlayerFuel;
	var distancePlayerWrench;
	var distancePlayerKeyLight;
	var distancePlayerFuelLight;
	var distancePlayerWrenchLight;
	var distancePlayerBonfire;
	var distancePlayerCar;
	var torchLightOn = false;
	var carLightOn = false;
	
	var playerCamera = true;
	var objectNumber = 0;
	var bonfireOn = false;
	var tmp;
	
	var clock = new Clock();

//*****************
//  lights        *
//*****************
	
	var ambientLight = new THREE.AmbientLight(ambientLightDiff, 0.5);
	scene.add(ambientLight);
	
	const spotLightTorch = new THREE.SpotLight( 0x000000, 1.0, 0, Math.PI/10);
	spotLightTorch.castShadow = true;	
	spotLightTorch.shadow.camera.near = 1.3;
	spotLightTorch.shadow.mapSize.width = 1024;
	spotLightTorch.shadow.mapSize.height = 1024;
	spotLightTorch.penumbra = 0.1;
	
	const pointLightBonfire = new THREE.PointLight( 0x000000, 1, 5, 0, 2);
	pointLightBonfire.position.set( 0, 3, 0 );
	
	const spotLightCar = new THREE.SpotLight( 0x000000, 25.0, 0, Math.PI/8);
	spotLightCar.castShadow = true;
	spotLightCar.shadow.mapSize.width = 1024;
	spotLightCar.shadow.mapSize.height = 1024;
	spotLightCar.shadow.camera.near = 3.5;
	spotLightCar.penumbra = 0.3;
		
	const pointLightGate = new THREE.PointLight(0xffffff, 1, 2, 2);
	pointLightGate.position.set(0, 2, 0);

	const spotLightFuel = new THREE.SpotLight(0x000000, 5.0, 2, Math.PI/10);
	const spotLightWrench = new THREE.SpotLight(0x000000, 5.0, 2, Math.PI/10);
	const spotLightKey = new THREE.SpotLight(0x000000, 5.0, 2, Math.PI/10);

	const directionalLight = new THREE.DirectionalLight( ambientLightDiff, 1 );
	directionalLight.castShadow = true;
	directionalLight.position.set(0, 40, -80);
	directionalLight.shadow.camera.left = -60;
	directionalLight.shadow.camera.right = 60;
	directionalLight.shadow.camera.top = 25;
	directionalLight.shadow.camera.bottom = -25;
	scene.add( directionalLight );

//*****************
//  models        *
//*****************
	
	let models = await loadModel();
	var playerMesh = models[1];
	var carMesh = models[6];
	var torchMesh = models[7];
	var fuelMesh = models[8];
	var keyMesh = models[9];
	var wrenchMesh = models[10];
	var bonfireMesh = models[11];
	var tendMesh = models[12];
	var gateMesh = models[16];
	

	torchMesh.grabbed = false;
	torchMesh.div = document.getElementById('divTorch');
	torchMesh.add(spotLightTorch);

	fuelMesh.grabbed = false;
	fuelMesh.div = document.getElementById('divFuel');
	spotLightFuel.target = fuelMesh;
	spotLightFuel.position.set(0, 2, 0);
	fuelMesh.add(spotLightFuel);

	keyMesh.grabbed = false;
	keyMesh.div = document.getElementById('divKey');
	spotLightKey.target = keyMesh;
	spotLightKey.position.set(0, 3, 0);
	keyMesh.add(spotLightKey);

	wrenchMesh.grabbed = false;
	wrenchMesh.div = document.getElementById('divWrench');
	spotLightWrench.target = wrenchMesh;
	spotLightWrench.position.set(0, 20, 0);
	wrenchMesh.add(spotLightWrench);

	bonfireMesh.getObjectByName("pSphere1_lambert1_0").visible = false;
	bonfireMesh.grabbed = false;
	bonfireMesh.div = document.getElementById('divBonfire');
	bonfireMesh.add(pointLightBonfire);
	
	carMesh.div = document.getElementById('divCar');
	
	gateMesh.add(pointLightGate);

	
	tmp = {
		scene: scene,
		world: world, 
		camera: camera,
		spotLightTorch: spotLightTorch,
		spotLightCar: spotLightCar,
		models: models
	}
	
	buildEnvironment(tmp);

	if(fpCamera){
		camera.position.copy(fpCameraPosition);
		window.addEventListener("mousemove", onMouseMove, false);
	}else
		camera.position.copy(tpCameraPosition);
		
	localStorage.clear();
	
	scene.traverse(function (child){
		if(child.isMesh){
			child.castShadow = true;
		}
	});

	
//*****************
//     audio      *
//*****************	


	const listener = new THREE.AudioListener();
	camera.add( listener );

	const sound = new THREE.Audio( listener );

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load( './Sounds/ambient.mp3', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop( true );
		sound.setVolume( 0.5 );
	});
	
	
//*****************
//  listeners     *
//*****************
	playerMesh.body.addEventListener("collide", function(e){
		
		let f = e.contact.bi.id;
		let s = e.contact.bj.id;
		
		if(f == 0 || s == 0 ||f == 2 || s == 2){
			canJump = true;
			canWalk = true;
		}
		
		if(f == 3 || s == 3)
			canWalk = true;
		
	});
		
	carMesh.body2.addEventListener("collide", function(e){
		let f = e.contact.bi.id;
		let s = e.contact.bj.id;
		
		if(f == 8 || s == 8){
			document.getElementById("winModal").style.display = 'block';
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("mousemove", onMouseMove);
		}

	});
	

	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keyup", onKeyUp, false);
	
	document.getElementById("mutedIcon").addEventListener("click", function() {
		document.getElementById("mutedIcon").style.display = 'none';
		document.getElementById("unmutedIcon").style.display = 'block';
	  
		sound.play();
	});
	
	document.getElementById("unmutedIcon").addEventListener("click", function() {
		document.getElementById("mutedIcon").style.display = 'block';
		document.getElementById("unmutedIcon").style.display = 'none';
	  
		sound.pause();
	});
	
	document.getElementById("resume").addEventListener("click", function(){
		window.addEventListener("keydown", onKeyDown, false);
		window.addEventListener("keyup", onKeyUp, false);
		if(fpCamera)
			window.addEventListener("mousemove", onMouseMove, false);
	});
	
//*****************
//  animations    *
//*****************
	
	var idleAnimation = animationsLoader.idleAnimation(playerMesh);
	var walkAnimation = animationsLoader.walkAnimation(playerMesh);
	var walkTorchAnimation = animationsLoader.walkTorchAnimation(playerMesh);
	var bonfireAnimation = animationsLoader.bonfireAnimation(bonfireMesh);
	var runAnimation = walkAnimation;

	bonfireAnimation.start();
		
//*****************
//  functions     *
//*****************

	function animate(){
		requestAnimationFrame( animate );
		
		let delta = clock.getDelta()
		if (delta > 0.1) delta = 0.1;
		world.step(delta);
		
		tmp = {
			playerMesh: playerMesh,
			objects: [torchMesh, keyMesh, fuelMesh, wrenchMesh, bonfireMesh, carMesh]
		};

		tmp = checkDistance(tmp);
		distancePlayerTorch = tmp[0][0];
		distancePlayerKey = tmp[0][1];
		distancePlayerFuel = tmp[0][2];
		distancePlayerWrench = tmp[0][3];
		distancePlayerBonfire = tmp[0][4];
		distancePlayerCar = tmp[0][5];
		distancePlayerKeyLight = tmp[1][0];
		distancePlayerFuelLight = tmp[1][1];
		distancePlayerWrenchLight = tmp[1][2];

		
		if(distancePlayerKeyLight)
			spotLightKey.color.setHex(0xffffff);
		else
			spotLightKey.color.setHex(0x000000);

		if(distancePlayerFuelLight)
			spotLightFuel.color.setHex(0xffffff);
		else
			spotLightFuel.color.setHex(0x000000);

		if(distancePlayerWrenchLight)
			spotLightWrench.color.setHex(0xffffff);
		else
			spotLightWrench.color.setHex(0x000000);
		
		if(playerCamera){
			move();
			setPosition(playerMesh);
		}
		else{
			moveCar();
			setPositionCar(carMesh);
		}
		
		TWEEN.update()
		renderer.render( scene, camera ); 
	}

	
		
	function move(){
		if (keyD) {
			playerMesh.body.angularVelocity.y = -Math.PI/1.5;
		}else if(keyA){
			playerMesh.body.angularVelocity.y = Math.PI/1.5;
		}else{
			playerMesh.body.angularVelocity.setZero();
		}	
		
		if (keyS) {
			const vector = new THREE.Vector3();
			playerMesh.getWorldDirection(vector);
			const cameraDirection = vector.multiplyScalar(-10);
			playerMesh.body.velocity.x = cameraDirection.x;
			playerMesh.body.velocity.z = cameraDirection.z;
			if(canWalk)
				runAnimation.start();
			idleAnimation.stop();
			
		}else if (keyW) {
			const vector = new THREE.Vector3();
			playerMesh.getWorldDirection(vector);
			
			const cameraDirection = vector.multiplyScalar(10);
			playerMesh.body.velocity.x = cameraDirection.x;
			playerMesh.body.velocity.z = cameraDirection.z;
			idleAnimation.stop();
			if(canWalk)
				runAnimation.start();
			idleAnimation.stop();

		}else{
			playerMesh.body.velocity.x = 0;
			playerMesh.body.velocity.z = 0;
			walkAnimation.stop();
			runAnimation.stop();
			idleAnimation.start	();

			//Put in idle position
			if (canWalk)
				restingPosition(playerMesh);

		}
	}
	
	function moveCar(){
		if (keyRightArrow) {
			carMesh.getObjectByName("mesh_8").rotation.y = -Math.PI/4;
			carMesh.getObjectByName("mesh_9").rotation.y = -Math.PI/4;
		}else if(keyLeftArrow){
			carMesh.getObjectByName("mesh_8").rotation.y = Math.PI/4;
			carMesh.getObjectByName("mesh_9").rotation.y = Math.PI/4;
		}else{
			carMesh.getObjectByName("mesh_8").rotation.y = 0;
			carMesh.getObjectByName("mesh_9").rotation.y = 0;
		}	

		if (keyUpArrow){
			const vector = new THREE.Vector3();
			carMesh.getObjectByName("mesh_9").getWorldDirection(vector);
			carMesh.body2.angularVelocity.y = carMesh.getObjectByName("mesh_9").rotation.y;			
			carMesh.getObjectByName("mesh_10").rotation.x += Math.PI/10;
			carMesh.getObjectByName("mesh_11").rotation.x += Math.PI/10;
			const cameraDirection = vector.multiplyScalar(10);
			carMesh.body2.velocity.x = cameraDirection.x;
			carMesh.body2.velocity.z = cameraDirection.z;
		}else if(keyDownArrow){
			const vector = new THREE.Vector3();
			carMesh.getObjectByName("mesh_9").getWorldDirection(vector);			
			carMesh.getObjectByName("mesh_10").rotation.x -= Math.PI/10;
			carMesh.getObjectByName("mesh_11").rotation.x -= Math.PI/10;
			carMesh.body2.angularVelocity.y = -carMesh.getObjectByName("mesh_9").rotation.y;
			const cameraDirection = vector.multiplyScalar(-10);
			carMesh.body2.velocity.x = cameraDirection.x;
			carMesh.body2.velocity.z = cameraDirection.z;
		}else{
			carMesh.body2.velocity.x = 0;
			carMesh.body2.velocity.z = 0;
			carMesh.body2.angularVelocity.setZero();
		}
	}


	function onKeyDown(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				keyD = true;
				break;
			case 83: //s
				keyS = true;
				break;
			case 65: //a
				keyA = true;
				break;
			case 87: //w
				keyW = true;
				break;
			case 32: //space
				if (canJump){
					canWalk = false;
					jumpPosition(playerMesh);
					runAnimation.stop();
					playerMesh.body.velocity.y = 6; 
					canJump = false;
				}
                break;
			case 69: //e
				if(distancePlayerTorch && !torchMesh.grabbed && playerCamera){
					//Grab torch
					torchMesh.grabbed = true;
					runAnimation.stop();
					runAnimation = walkTorchAnimation;
					setPositionGrabTorch(playerMesh);
					scene.remove(torchMesh);
					playerMesh.getObjectByName("mixamorigRightHand_035").add(torchMesh);
					torchMesh.position.copy(torchToPlayerPos);
					torchMesh.scale.multiplyScalar(1/0.03);
					divTorchLight.style.visibility = 'visible';
					setTimeout(function(){divTorchLight.style.visibility = 'hidden';},2000);
				}else if(torchMesh.grabbed && playerCamera){
					//Drop torch
					torchLightOn = false;
					torchMesh.grabbed = false;
					runAnimation.stop();
					runAnimation = walkAnimation;
					setPositionDropTorch(playerMesh);
					spotLightTorch.color.setHex(0x000000);
					playerMesh.getObjectByName("mixamorigRightHand_035").remove(torchMesh);
					torchMesh.scale.multiplyScalar(0.03);
					torchMesh.position.set(playerMesh.position.x, playerMesh.position.y+1, playerMesh.position.z);
					scene.add(torchMesh);
				}
			
				if(distancePlayerKey){
					keyMesh.position.y = -20;
					keyMesh.grabbed = true;
					objectNumber += 1;
					document.getElementById('objectNumber').innerHTML = 'Collected Object: '+objectNumber+'/3';
					document.getElementById('keyCollected').style.visibility='visible';
				}		
				if(distancePlayerFuel){
					fuelMesh.position.y = -20;
					fuelMesh.grabbed = true;
					objectNumber += 1;
					document.getElementById('objectNumber').innerHTML = 'Collected Object: '+objectNumber+'/3';
					document.getElementById('fuelCollected').style.visibility='visible';
				}		
				if(distancePlayerWrench){
					wrenchMesh.position.y = -20;
					wrenchMesh.grabbed = true;
					objectNumber += 1;
					document.getElementById('objectNumber').innerHTML = 'Collected Object: '+objectNumber+'/3';
					document.getElementById('wrenchCollected').style.visibility='visible';
				}
				if(distancePlayerBonfire){
					bonfireMesh.getObjectByName("pSphere1_lambert1_0").visible = !bonfireMesh.getObjectByName("pSphere1_lambert1_0").visible;
					if(bonfireOn)
						pointLightBonfire.color.setHex(0x000000);
					else
						pointLightBonfire.color.setHex(0xff0000);
					bonfireOn = !bonfireOn;
					
					
				}
				break;
			case 81: //q
				if(!playerCamera && !carLightOn){
					spotLightCar.color.setHex(0xffffff);
					carLightOn = true;
				}else if(!playerCamera && carLightOn){
					spotLightCar.color.setHex(0x000000);
					carLightOn = false;
				}else if(!torchLightOn && torchMesh.grabbed){
					spotLightTorch.color.setHex(0xedecca);
					torchLightOn = true;
				}else if(torchLightOn && torchMesh.grabbed){
					spotLightTorch.color.setHex(0x000000);
					torchLightOn = false;
				}
				break;
			case 90: //z
				if(!lockCamera && playerCamera){
					if(fpCamera){
						window.removeEventListener("mousemove", onMouseMove);
						camera.rotation.z = Math.PI;
						camera.rotation.x = -Math.PI/1.17;
						camera.rotation.y = 0;
						playerMesh.getObjectByName("mixamorigRightHand_035").rotation.y = 0;
						playerMesh.getObjectByName("mixamorigRightHand_035").rotation.z = 0;
						camera.position.copy(tpCameraPosition);
					}
					else{
						window.addEventListener("mousemove", onMouseMove, false);
						camera.position.copy(fpCameraPosition);
					}
					fpCamera = !fpCamera;
				}
				break;

			case 67: // c
				if(!playerCamera){
					//woody in the car
					
					carMesh.grabbed = false;
					carMesh.remove(camera);
					
					playerMesh.body.position.set(20,2,0);
				
					scene.add(playerMesh);
					playerMesh.add(camera);
					if(fpCamera){
						camera.position.copy(fpCameraPosition);
						window.addEventListener("mousemove", onMouseMove, false);
					}
					else
						camera.position.copy(tpCameraPosition);
					

					world.remove(carMesh.body2);
					world.add(carMesh.body);
					
					carMesh.body.position.set(
						carMesh.position.x,
						carMesh.position.y + (carMesh.dims.max.y-carMesh.dims.min.y)/2.0,
						carMesh.position.z
					);
					carMesh.body.quaternion.copy(carMesh.quaternion);
					
					playerCamera = !playerCamera;
				}else if(distancePlayerCar){
					if(objectNumber == 3){
						window.removeEventListener("mousemove", onMouseMove);

						carMesh.grabbed = true;
						playerMesh.remove(camera);
						scene.remove(playerMesh);
						playerMesh.position.x = 100;
						playerMesh.body.position.x = 100;
						carMesh.add(camera);
						camera.position.copy(carCameraPosition);

						camera.rotation.z = Math.PI;
						camera.rotation.x = -Math.PI/1.17;
						camera.rotation.y = 0;

						world.remove(carMesh.body);							
						world.add(carMesh.body2);
						
						

						divCarLight.style.visibility = 'visible';
						setTimeout(function(){divCarLight.style.visibility = 'hidden';},2000);
						playerCamera = !playerCamera;						
					}else{
						document.getElementById('divCarDisable').style.visibility = 'visible';
						document.getElementById('divCar').style.visibility = 'hidden';
						setTimeout(function(){document.getElementById('divCarDisable').style.visibility = 'hidden';},4000);
						
					}
				}
				break;

			case 37: // <--
				keyLeftArrow = true;
				break;

			case 39: // -->
				keyRightArrow = true;
				break;

			case 38:
				keyUpArrow = true;
				break;			
			
			case 40:
				keyDownArrow = true;
				break;
			
			case 27: //esc
				document.getElementById("quitGame").style.display = "block";
				window.removeEventListener("keydown", onKeyDown);
				window.removeEventListener("keyup", onKeyUp);
				window.removeEventListener("mousemove", onMouseMove);
				break;
			
		}
	}

	function onKeyUp(event) {
	  var keyCode = event.keyCode;

	  switch (keyCode) {
		case 68: //d
		  keyD = false;
		  break;
		case 83: //s
		  keyS = false;
		  break;
		case 65: //a
		  keyA = false;
		  break;
		case 87: //w
		  keyW = false;
		  break;
		case 37: // <--
			keyLeftArrow = false;
			break;
		case 39: // -->
			keyRightArrow = false;
			break;

		case 38:
			keyUpArrow = false;
			break;			
		
		case 40:
			keyDownArrow = false;
			break;
	  }
	}

	function onMouseMove(e){
		const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

		cameraEuler.x -= movementY * cameraSpeed;
		cameraEuler.x = Math.min(Math.max(cameraEuler.x, -0.5), 0.5);
		cameraEuler.y = Math.PI;
		
		camera.quaternion.setFromEuler(cameraEuler);
		let valY = mapRange(cameraEuler.y, 1.46, 4.48, Math.PI/2, -Math.PI/2);
		let valX = mapRange(cameraEuler.x, -0.5, 0.5, Math.PI/5, -Math.PI/4);
		
		playerMesh.body.angularVelocity.y -= movementX * cameraSpeed2;
		
		playerMesh.getObjectByName("mixamorigRightHand_035").rotation.z = valX;

	}
	
	
	function mapRange(number, inMin, inMax, outMin, outMax) {
		return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
	}

	document.getElementById("loaderContainer").style.visibility = "hidden";
	document.getElementById("objectCollected").style.visibility = "visible";	
	animate();
}

game();
