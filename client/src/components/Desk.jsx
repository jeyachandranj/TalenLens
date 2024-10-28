

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Desk(props) {
  const { nodes, materials } = useGLTF('/models/office_chair.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.005, 0, 0.002]} rotation={[-Math.PI / 2, 0, 0]} scale={0.967}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group scale={0.01}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Leg_LP4_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-3.462, 0, 10.655]}
              rotation={[-Math.PI, Math.PI / 5, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Leg_LP1_lambert1_0.geometry}
              material={materials.lambert1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Wheel_LP_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-58.139, 0, 48.659]}
              rotation={[-Math.PI, 0.114, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder25_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-58.139, 0, 48.659]}
              rotation={[-Math.PI, 0.114, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.ChairBack_LP_lambert1_0.geometry}
              material={materials.lambert1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.ChairSeat_LP4_lambert1_0.geometry}
              material={materials.lambert1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder26_lambert1_0.geometry}
              material={materials.lambert1}
              position={[31.27, 0, -31.948]}
              rotation={[0, 0.895, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Wheel_LP1_lambert1_0.geometry}
              material={materials.lambert1}
              position={[31.27, 0, -31.948]}
              rotation={[0, 0.895, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Leg_LP5_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-5.602, 0, 4.07]}
              rotation={[0, 1.257, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Underside_LP_lambert1_0.geometry}
              material={materials.lambert1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCube38_lambert1_0.geometry}
              material={materials.lambert1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Wheel_LP2_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-3.632, 0, 3.211]}
              rotation={[0, 1.2, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder27_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-3.632, 0, 3.211]}
              rotation={[0, 1.2, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCube37_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-33.983, 64.178, -14.779]}
              scale={[0.061, 0.036, 0.062]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder28_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-26.088, 0, -16.813]}
              rotation={[-Math.PI, 0.492, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Wheel_LP3_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-26.088, 0, -16.813]}
              rotation={[-Math.PI, 0.492, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Leg_LP3_lambert1_0.geometry}
              material={materials.lambert1}
              position={[3.463, 0, 10.655]}
              rotation={[-Math.PI, -Math.PI / 5, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder29_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-64.369, 0, -4.511]}
              rotation={[-Math.PI, 0.495, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Wheel_LP4_lambert1_0.geometry}
              material={materials.lambert1}
              position={[-64.369, 0, -4.511]}
              rotation={[-Math.PI, 0.495, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Leg_LP2_lambert1_0.geometry}
              material={materials.lambert1}
              position={[5.602, 0, 4.07]}
              rotation={[0, -1.257, 0]}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/office_chair.glb')
