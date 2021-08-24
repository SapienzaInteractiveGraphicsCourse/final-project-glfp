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
	playerMesh.getObjectByName("RightHandThumb2_31").rotation.x = -Math.PI/8;
	playerMesh.getObjectByName("RightHandThumb1_32").rotation.x = Math.PI/3;
	playerMesh.getObjectByName("RightHandIndex3_34").rotation.x = Math.PI/5;
	playerMesh.getObjectByName("RightHandIndex2_35").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("RightHandMiddle3_38").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("RightHandMiddle2_39").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("RightHandRing3_42").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("RightHandRing2_43").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("RightHandPinky3_46").rotation.x = Math.PI/2;
	playerMesh.getObjectByName("RightHandPinky2_47").rotation.x = Math.PI/2;
}

export function setPositionDropTorch(playerMesh){
	playerMesh.getObjectByName("RightHandThumb2_31").rotation.x = Math.PI/12.8;
	playerMesh.getObjectByName("RightHandThumb1_32").rotation.x = Math.PI/16.84;
	playerMesh.getObjectByName("RightHandIndex3_34").rotation.x = -Math.PI/112;
	playerMesh.getObjectByName("RightHandIndex2_35").rotation.x = Math.PI/7.85;
	playerMesh.getObjectByName("RightHandMiddle2_39").rotation.x = -Math.PI/47.6;
	playerMesh.getObjectByName("RightHandMiddle3_38").rotation.x = Math.PI/8.40;
	playerMesh.getObjectByName("RightHandRing2_43").rotation.x = -Math.PI/17.12;
	playerMesh.getObjectByName("RightHandRing3_42").rotation.x = Math.PI/16.36;
	playerMesh.getObjectByName("RightHandPinky2_47").rotation.x = -Math.PI/21.3;
	playerMesh.getObjectByName("RightHandPinky3_46").rotation.x = Math.PI/8;
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
	carMesh.body.position.y=1;

	carMesh.position.set(
		carMesh.body.position.x,
		carMesh.body.position.y-1,
		carMesh.body.position.z
	)	
	
	carMesh.body.quaternion.x = 0;
	//carMesh.body.quaternion.y = 0;
	carMesh.body.quaternion.z = 0;



	carMesh.quaternion.copy(carMesh.body.quaternion);
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

export function checkContact(world, idA, idB){
    for(var i=0; i<world.contacts.length; i++){
        var c = world.contacts[i];
        if((c.bi.id === idA && c.bj.id === idB) || (c.bi.id === idB && c.bj.id === idA)){
            return true;
        }
    }
    return false;
}

export default {restingPosition, setPositionGrabTorch, setPositionDropTorch, jumpPosition, setPosition, checkDistance, checkContact, setPositionCar}