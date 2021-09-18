export function restingPosition(playerMesh){
		playerMesh.getObjectByName("mixamorigLeftArm_09").rotation.x = Math.PI/4;
		playerMesh.getObjectByName("mixamorigLeftForeArm_010").rotation.x = Math.PI/8;
		playerMesh.getObjectByName("mixamorigRightArm_033").rotation.x = Math.PI/4;
		playerMesh.getObjectByName("mixamorigRightForeArm_034").rotation.x = Math.PI/8;
		
		playerMesh.getObjectByName("mixamorigLeftArm_09").rotation.z = 0;
		playerMesh.getObjectByName("mixamorigLeftForeArm_010").rotation.z = 0;
		playerMesh.getObjectByName("mixamorigRightArm_033").rotation.z = 0;
		playerMesh.getObjectByName("mixamorigRightForeArm_034").rotation.z = 0;
		playerMesh.getObjectByName("mixamorigLeftUpLeg_056").rotation.x = 0;
		playerMesh.getObjectByName("mixamorigLeftLeg_057").rotation.x = 0;
		playerMesh.getObjectByName("mixamorigRightUpLeg_00").rotation.x = 0;
		playerMesh.getObjectByName("mixamorigRightLeg_061").rotation.x = 0;
		playerMesh.getObjectByName("mixamorigSpine_02").rotation.x = 0;
		playerMesh.jumpFactor = 0;
}


export function setPositionGrabTorch(playerMesh){
	playerMesh.getObjectByName("mixamorigRightHandIndex2_041").rotation.x = Math.PI/5;
	playerMesh.getObjectByName("mixamorigRightHandIndex3_042").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("mixamorigRightHandMiddle2_045").rotation.x = Math.PI/5;
	playerMesh.getObjectByName("mixamorigRightHandMiddle3_046").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("mixamorigRightHandRing2_049").rotation.x = Math.PI/5;
	playerMesh.getObjectByName("mixamorigRightHandRing3_050").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("mixamorigRightHandPinky2_053").rotation.x = Math.PI/5;
	playerMesh.getObjectByName("mixamorigRightHandPinky3_054").rotation.x = Math.PI/2;
}

export function setPositionDropTorch(playerMesh){
	playerMesh.getObjectByName("mixamorigRightHandIndex2_041").rotation.x = 0.20034949371200378;
	playerMesh.getObjectByName("mixamorigRightHandIndex3_042").rotation.x = -0.021836310415530375;
	playerMesh.getObjectByName("mixamorigRightHandMiddle2_045").rotation.x = 0.3103758793083265;
	playerMesh.getObjectByName("mixamorigRightHandMiddle3_046").rotation.x = 0.020598661892058456;
	playerMesh.getObjectByName("mixamorigRightHandRing2_049").rotation.x = 0.42332588769706075;
	playerMesh.getObjectByName("mixamorigRightHandRing3_050").rotation.x = 0.13598526401803093;
	playerMesh.getObjectByName("mixamorigRightHandPinky2_053").rotation.x = 0.37231352781831506;
	playerMesh.getObjectByName("mixamorigRightHandPinky3_054").rotation.x = 0.07624927272306639;

}

export function jumpPosition(playerMesh){
	playerMesh.getObjectByName("mixamorigLeftArm_09").rotation.z = 0;
	playerMesh.getObjectByName("mixamorigLeftForeArm_010").rotation.z = Math.PI/4;
	playerMesh.getObjectByName("mixamorigRightArm_033").rotation.z = -Math.PI/4;
	playerMesh.getObjectByName("mixamorigRightForeArm_034").rotation.z = -Math.PI/2;
	playerMesh.getObjectByName("mixamorigLeftUpLeg_056").rotation.x = Math.PI/4;
	playerMesh.getObjectByName("mixamorigLeftLeg_057").rotation.x = -Math.PI/6;
	playerMesh.getObjectByName("mixamorigRightUpLeg_00").rotation.x = -Math.PI/4;
	playerMesh.getObjectByName("mixamorigRightLeg_061").rotation.x = -Math.PI/8;
}


export function setPosition(playerMesh){
	let plDimY = playerMesh.plDimY;
	playerMesh.position.set(
		playerMesh.body.position.x,
		playerMesh.body.position.y-1,
		playerMesh.body.position.z
	)	
	
	playerMesh.body.quaternion.x = 0;
	playerMesh.body.quaternion.z = 0;
	playerMesh.body.velocity.y = Math.min(playerMesh.body.velocity.y, 6);

	playerMesh.quaternion.copy(playerMesh.body.quaternion);
}


export function setPositionCar(carMesh){
	carMesh.body2.position.y= 1;

	carMesh.position.set(
		carMesh.body2.position.x,
		carMesh.body2.position.y-1,
		carMesh.body2.position.z
	)	
	
	carMesh.body2.quaternion.x = 0;
	carMesh.body2.quaternion.z = 0;

	carMesh.quaternion.copy(carMesh.body2.quaternion);
}

export function checkDistance(values){
	let plPosition = values.playerMesh.position;
	let position;
	let tmp = [];
	let tmp2 = [];
	for(let i = 0; i < values.objects.length; i++){
		position = values.objects[i].position;
		if(values.objects[i].div.id == "divCar" && !values.objects[i].grabbed && plPosition.distanceTo(position) < 8.0){
			values.objects[i].div.style.visibility = 'visible'
			tmp.push(true);
		}
		else if(plPosition.distanceTo(position) < 2.0 && !values.objects[i].grabbed){
			values.objects[i].div.style.visibility = 'visible'
			tmp.push(true);
		}
		else{
			values.objects[i].div.style.visibility = 'hidden'
			tmp.push(false);
		}
		
		if((values.objects[i].div.id == "divKey" || values.objects[i].div.id == "divFuel"  || values.objects[i].div.id == "divWrench") &&
			plPosition.distanceTo(position) < 7.0)
			tmp2.push(true);
		else if(values.objects[i].div.id == "divKey" || values.objects[i].div.id == "divFuel"  || values.objects[i].div.id == "divWrench")
			tmp2.push(false);
	}

	return [tmp, tmp2];
}

export default {restingPosition, setPositionGrabTorch, setPositionDropTorch, jumpPosition, setPosition, checkDistance, setPositionCar}