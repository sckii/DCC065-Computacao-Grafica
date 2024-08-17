import * as THREE from  'three';

export const convertVector3ToEuler = (direction) => {
  // Normalizar a direção para garantir que seja um vetor unitário
  const normalizedDirection = direction.clone().normalize();

  // Criar um quaternion a partir do vetor de direção
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), // Vetor de referência (frente z+)
      normalizedDirection // Direção normalizada
  );

  // Converter o quaternion para ângulos de Euler
  const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');

  return euler; // Ângulos de Euler em radianos
}

export const getChancesOf = (chance) => {
  let randomInt = Math.floor(Math.random() * 1000);
  return randomInt <= chance;
}

export function rotateObjectToVector(object, targetVector) {
  // Normalizar o vetor de direção
  const normalizedVector = targetVector.clone().normalize();

  // Criar um quaternion que rotaciona do eixo Z positivo para o vetor alvo
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), // Vetor de referência (frente z+)
      normalizedVector
  );

  // Converter o quaternion para ângulos de Euler
  const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');

  // Aplicar os ângulos de Euler ao objeto
  object.rotation.copy(euler);
}