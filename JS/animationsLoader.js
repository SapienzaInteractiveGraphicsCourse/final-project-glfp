export function idleAnimation(playerMesh){
	let idleValues = {
		mixamorigSpine2_04: Math.PI/25
	};
	let idleAnim = new TWEEN.Tween(idleValues);
	idleAnim.to({
		mixamorigSpine2_04: 0
	}, 1000);
	idleAnim.onUpdate(function(object){
		playerMesh.getObjectByName("mixamorigSpine1_03").rotation.x = object.mixamorigSpine2_04;
	});
	idleAnim.repeat(Infinity);
	idleAnim.yoyo(true);
	
	return idleAnim;
}

export function walkAnimation(playerMesh){
	let walkValues = {
		mixamorigLeftArm_09: -Math.PI/4,
		mixamorigRightArm_033: -Math.PI/4,
		mixamorigLeftUpLeg_056: -Math.PI/4,
		mixamorigRightUpLeg_00: Math.PI/4
	};
	let walkAnim = new TWEEN.Tween(walkValues);
	walkAnim.to({
		mixamorigLeftArm_09: Math.PI/4,
		mixamorigRightArm_033: Math.PI/4,
		mixamorigLeftUpLeg_056: Math.PI/4,
		mixamorigRightUpLeg_00: -Math.PI/4
	}, 500);
	walkAnim.onUpdate(function(object){
		playerMesh.getObjectByName("mixamorigLeftArm_09").rotation.z = object.mixamorigLeftArm_09;
		playerMesh.getObjectByName("mixamorigLeftForeArm_010").rotation.z = Math.PI/2;

		playerMesh.getObjectByName("mixamorigRightArm_033").rotation.z = object.mixamorigRightArm_033;
		playerMesh.getObjectByName("mixamorigRightForeArm_034").rotation.z = -Math.PI/2;
		
		playerMesh.getObjectByName("mixamorigLeftUpLeg_056").rotation.x = object.mixamorigLeftUpLeg_056;
		playerMesh.getObjectByName("mixamorigLeftLeg_057").rotation.x = -Math.PI/6;

		playerMesh.getObjectByName("mixamorigRightUpLeg_00").rotation.x = object.mixamorigRightUpLeg_00;
		playerMesh.getObjectByName("mixamorigRightLeg_061").rotation.x = -Math.PI/6;
		
		playerMesh.getObjectByName("mixamorigSpine_02").rotation.x = Math.PI/14;
	});
	walkAnim.repeat(Infinity);
	walkAnim.yoyo(true);
	
	return walkAnim;
}

export function walkTorchAnimation(playerMesh){
	let walkTorchValues = {
		mixamorigLeftArm_09: -Math.PI/4,
		mixamorigLeftUpLeg_056: -Math.PI/4,
		mixamorigLeftLeg_057: -Math.PI/6,
		mixamorigRightUpLeg_00: Math.PI/4
	};
	let walkTorchAnim = new TWEEN.Tween(walkTorchValues);
	walkTorchAnim.to({
		mixamorigLeftArm_09: Math.PI/4,
		mixamorigLeftUpLeg_056: Math.PI/4,
		mixamorigLeftLeg_057: -Math.PI/6,
		mixamorigRightUpLeg_00: -Math.PI/4
	}, 500);
	walkTorchAnim.onUpdate(function(object){
		playerMesh.getObjectByName("mixamorigLeftArm_09").rotation.z = object.mixamorigLeftArm_09;
		playerMesh.getObjectByName("mixamorigLeftForeArm_010").rotation.z = Math.PI/2;

		playerMesh.getObjectByName("mixamorigRightArm_033").rotation.z = 0;
		playerMesh.getObjectByName("mixamorigRightForeArm_034").rotation.z = 0;
		
		playerMesh.getObjectByName("mixamorigLeftUpLeg_056").rotation.x = object.mixamorigLeftUpLeg_056;
		playerMesh.getObjectByName("mixamorigLeftLeg_057").rotation.x = object.mixamorigLeftLeg_057;

		playerMesh.getObjectByName("mixamorigRightUpLeg_00").rotation.x = object.mixamorigRightUpLeg_00;
		playerMesh.getObjectByName("mixamorigRightLeg_061").rotation.x = -Math.PI/6;
		
		playerMesh.getObjectByName("mixamorigSpine_02").rotation.x = Math.PI/14;
	});
	walkTorchAnim.repeat(Infinity);
	walkTorchAnim.yoyo(true);

	return walkTorchAnim;
}


export function bonfireAnimation(bonfireMesh){
	let bonfireValues = {
		rotY: 0
	};
	let bonfireAnim = new TWEEN.Tween(bonfireValues);
	bonfireAnim.to({
		rotY: 2*Math.PI
	}, 3000);
	bonfireAnim.onUpdate(function(object){
		bonfireMesh.getObjectByName("pSphere1_lambert1_0").rotation.y = object.rotY;
	});
	bonfireAnim.repeat(Infinity);

	return bonfireAnim;
}




export default {idleAnimation, walkAnimation, walkTorchAnimation, bonfireAnimation }