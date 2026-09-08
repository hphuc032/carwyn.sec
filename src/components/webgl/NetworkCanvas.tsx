"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, WebGLRenderer, type Group, type Mesh } from "three";
import { network, nodeColor } from "@/lib/network-topology";

type Props = { active: boolean; onReady: (ready: boolean) => void; onFailure: () => void };
// R3F disposes its renderer after unmount. A lost context needs no second loss.
class NetworkRenderer extends WebGLRenderer {
  constructor(...args: ConstructorParameters<typeof WebGLRenderer>) {
    super(...args);
    // Three defines this method on the instance, so install the guarded operation
    // after construction. Disposal still runs normally; the extension is optional.
    this.forceContextLoss = () => {
      const context = this.getContext();
      if (!context.isContextLost()) context.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }
}
function positionSignal(mesh: Mesh | null, edgeIndex: number, progress: number) {
  if (!mesh) return;
  mesh.visible = progress >= 0 && progress <= 1;
  if (!mesh.visible) return;
  const [a, b] = network.edges[edgeIndex]!;
  const p = network.nodes[a]!, q = network.nodes[b]!;
  mesh.position.set(p[0] + (q[0] - p[0]) * progress, p[1] + (q[1] - p[1]) * progress, p[2] + (q[2] - p[2]) * progress);
}
function NetworkScene({ active, onReady, onFailure }: Props) {
  const group = useRef<Group>(null);
  const signalA = useRef<Mesh>(null);
  const signalB = useRef<Mesh>(null);
  const target = useRef({ x: 0, y: 0 });
  const pulseStart = useRef(-Infinity);
  const movingUntil = useRef(0);
  const announced = useRef(false);
  const { invalidate, gl } = useThree();
  useEffect(() => () => onReady(false), [onReady]);
  const data = useMemo(() => {
    const positions = new Float32Array(network.nodes.flat());
    const colors = new Float32Array(network.nodes.length * 3);
    const edges = new Float32Array(network.edges.length * 6);
    const edgeColors = new Float32Array(network.edges.length * 6);
    const color = new Color();
    network.nodes.forEach((point, index) => {
      color.set(nodeColor(index)).multiplyScalar(.35 + (point[2] + 1) * .3);
      color.toArray(colors, index * 3);
    });
    network.edges.forEach(([a, b], index) => {
      const p = network.nodes[a]!, q = network.nodes[b]!;
      edges.set(p, index * 6); edges.set(q, index * 6 + 3);
      color.set("#88939b").multiplyScalar(.14 + (p[2] + q[2] + 2) * .105);
      color.toArray(edgeColors, index * 6); color.toArray(edgeColors, index * 6 + 3);
    });
    return { positions, colors, edges, edgeColors };
  }, []);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => {
    if (!active) return;
    const hero = document.getElementById("hero");
    let tick = 0;
    let pulseTimer = 0;
    const wake = () => {
      if (tick) return;
      const draw = () => {
        tick = 0;
        invalidate();
        const now = performance.now();
        if (now < movingUntil.current || now - pulseStart.current < 1800) tick = window.setTimeout(draw, 1000 / 30);
      };
      draw();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !hero) return;
      const bounds = hero.getBoundingClientRect();
      target.current.y = ((event.clientX - bounds.left) / bounds.width - .5) * .22;
      target.current.x = ((event.clientY - bounds.top) / bounds.height - .5) * .16;
      movingUntil.current = performance.now() + 450; wake();
    };
    const reset = () => { target.current.x = 0; target.current.y = 0; movingUntil.current = performance.now() + 450; wake(); };
    const pulse = () => { pulseStart.current = performance.now(); wake(); pulseTimer = window.setTimeout(pulse, 9000); };
    pulseTimer = window.setTimeout(pulse, 5000);
    hero?.addEventListener("pointermove", move, { passive: true });
    hero?.addEventListener("pointerleave", reset);
    invalidate();
    return () => {
      clearTimeout(tick); clearTimeout(pulseTimer); pulseStart.current = -Infinity;
      hero?.removeEventListener("pointermove", move); hero?.removeEventListener("pointerleave", reset);
    };
  }, [active, invalidate]);
  useFrame(() => {
    if (!announced.current) { announced.current = true; onReady(true); }
    if (!active || !group.current) return;
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * .22;
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * .22;
    const elapsed = performance.now() - pulseStart.current;
    // Two short packets on fixed local edges; no allocation or geometry changes.
    positionSignal(signalA.current, 38, elapsed / 1300);
    positionSignal(signalB.current, 81, (elapsed - 350) / 1300);
  });
  return <group ref={group}>
    <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[data.edges, 3]} /><bufferAttribute attach="attributes-color" args={[data.edgeColors, 3]} /></bufferGeometry><lineBasicMaterial vertexColors toneMapped={false} /></lineSegments>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[data.positions, 3]} /><bufferAttribute attach="attributes-color" args={[data.colors, 3]} /></bufferGeometry><pointsMaterial size={2.6} sizeAttenuation={false} vertexColors toneMapped={false} /></points>
    <mesh ref={signalA} visible={false}><sphereGeometry args={[.012, 6, 4]} /><meshBasicMaterial color="#00ffb2" toneMapped={false} /></mesh>
    <mesh ref={signalB} visible={false}><sphereGeometry args={[.012, 6, 4]} /><meshBasicMaterial color="#00c8ff" toneMapped={false} /></mesh>
  </group>;
}

export default function NetworkCanvas(props: Props) {
  return <div className="network-live"><Canvas orthographic camera={{ position: [0, 0, 4], near: .1, far: 10, left: -250 / 195, right: 250 / 195, top: 250 / 195, bottom: -250 / 195 }} dpr={[1, 1.5]} frameloop={props.active ? "demand" : "never"}
    gl={(defaults) => new NetworkRenderer({ ...defaults, antialias: true, alpha: true, powerPreference: "low-power" })} fallback={null}>
    <NetworkScene {...props} />
  </Canvas></div>;
}
