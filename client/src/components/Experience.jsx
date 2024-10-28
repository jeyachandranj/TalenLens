import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { Desk } from "./Desk";
import { useEffect, useRef, useState } from "react";
import { Table } from "./Table";
import { Room } from "./Room";

export const Experience = ({ response }) => {
  const controls = useRef();
  const texture = useTexture("textures/home.jpg");
  const viewport = useThree((state) => state.viewport);

  const newWidth = viewport.width * 3.5;
  const newHeight = viewport.height * 3;

  const initialState = {
    avatarPosition: [-2, -2, 2],
    avatarScale: 1,
    deskPosition: [-2, -2, 2],
    deskScale: 1,
    tablePosition: [-2, -1.5, 2],
    tableScale: 1,
    roomPosition: [-2.5, -1.2, 1],
    roomScale: 1,
  };

  const finalState = {
    avatarPosition: [-0.8, -2.3, 6],
    avatarScale: 1.7,
    deskPosition: [-0.9, -2.5, 5],
    deskScale: 2,
    tablePosition: [-0.8, -1.5, 6],
    tableScale: 1.4,
    roomPosition: [-0.5, -1, 2],
    roomScale: 1.8,
  };

  const [state, setState] = useState(initialState);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1; 
    const delay = 1; 
    const totalDuration = duration + delay; 
    let startTime;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      if (elapsed >= delay) {
        const animationProgress = Math.min((elapsed - delay) / duration, 1);
        setProgress(animationProgress);
      }

      if (elapsed < totalDuration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useFrame(() => {
    const interpolate = (start, end, factor) => {
      if (Array.isArray(start)) {
        return start.map((s, i) => s + (end[i] - s) * factor);
      }
      return start + (end - start) * factor;
    };

    setState({
      avatarPosition: interpolate(initialState.avatarPosition, finalState.avatarPosition, progress),
      avatarScale: interpolate(initialState.avatarScale, finalState.avatarScale, progress),
      deskPosition: interpolate(initialState.deskPosition, finalState.deskPosition, progress),
      deskScale: interpolate(initialState.deskScale, finalState.deskScale, progress),
      tablePosition: interpolate(initialState.tablePosition, finalState.tablePosition, progress),
      tableScale: interpolate(initialState.tableScale, finalState.tableScale, progress),
      roomPosition: interpolate(initialState.roomPosition, finalState.roomPosition, progress),
      roomScale: interpolate(initialState.roomScale, finalState.roomScale, progress),
    });
  });

  return (
    <>
      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 1.9}
        minAzimuthAngle={-Math.PI / 8}
        maxAzimuthAngle={Math.PI / 8}
        target={[0, -0.9, 9]}
        ref={controls}
      />
      <Avatar position={state.avatarPosition} scale={state.avatarScale} response={response} />
      <Desk position={state.deskPosition} scale={state.deskScale} />
      <Table position={state.tablePosition} scale={state.tableScale} />
      <Room position={state.roomPosition} scale={state.roomScale} />
      
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[newWidth, newHeight]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
