"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, ReactThreeFiber, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";

/** Holographic foil shader; pointer hotspot + fresnel; mask-ready */
const HoloMaterial = shaderMaterial(
  {
    u_time: 0,
    u_hover: 0,
    u_pointer: new THREE.Vector2(0.5, 0.5),
    u_baseColor: new THREE.Color("#0f172a"),
    u_mask: null as THREE.Texture | null,
    u_dim: 0,
  },
  /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDirW = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`,
  /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  uniform float u_time;
  uniform float u_hover;
  uniform vec2 u_pointer;
  uniform vec3 u_baseColor;
  uniform sampler2D u_mask;
  uniform float u_dim;

  vec3 iridescence(float x){
    return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + x));
  }

  void main() {
    vec3 base = u_baseColor;

    float vdotn = clamp(dot(normalize(vViewDirW), normalize(vNormalW)), 0.0, 1.0);
    float fres = pow(1.0 - vdotn, 2.0);

    float bands = sin((vUv.y * 6.0) + (u_time * 1.3)) * 0.5 + 0.5;

    float dist = distance(vUv, u_pointer);
    float hotspot = smoothstep(0.36, 0.0, dist);

    float mask = 1.0;
    if (u_mask != sampler2D(0)) {
      mask = texture2D(u_mask, vUv).r;
    }

    float foilStrength = mix(0.10, 0.55, u_hover);
    float holo = (bands * 0.6 + hotspot * 0.9 + fres * 0.45) * foilStrength;
    vec3 holoCol = iridescence(vUv.y * 2.0 + u_time * 0.25 + vUv.x * 0.5);

    vec3 color = base + holoCol * holo * mask;

    // dim when not active row
    color = mix(color, color * 0.6, u_dim);

    // gentle edge glow; no clipping
    float edge = smoothstep(0.985, 0.92, max(max(vUv.x, 1.0-vUv.x), max(vUv.y, 1.0-vUv.y)));
    color += vec3(0.10,0.16,0.22) * edge * 0.22;

    gl_FragColor = vec4(color, 1.0);
  }`
);

extend({ HoloMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      holoMaterial: ReactThreeFiber.Object3DNode<any, any>;
    }
  }
}

export default function HoloCard({
  width = 2.6,
  height = 3.6,
  title,
  subtitle,
  onClick,
  interactive = true,
  dimmed = false,
}: {
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  interactive?: boolean;
  dimmed?: boolean;
}) {
  const material = useRef<any>(null);
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  // Rounded card geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 0.14;
    const w = width, h = height;
    shape.moveTo(-w/2 + r, -h/2);
    shape.lineTo(w/2 - r, -h/2);
    shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
    shape.lineTo(w/2, h/2 - r);
    shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
    shape.lineTo(-w/2 + r, h/2);
    shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
    shape.lineTo(-w/2, -h/2 + r);
    shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
    const geo = new THREE.ShapeGeometry(shape, 16);
    geo.computeVertexNormals();
    return geo;
  }, [width, height]);

  // local UV target (from pointer move) → smoothed to shader + tilt
  const targetUV = useRef(new THREE.Vector2(0.5, 0.5));

  useFrame((_s, dt) => {
    if (material.current) {
      material.current.u_time += dt;
      material.current.u_hover = THREE.MathUtils.damp(material.current.u_hover, hovered ? 1 : 0, 4, dt);
      material.current.u_pointer.lerp(targetUV.current, 0.22); // smooth hotspot
      material.current.u_dim = dimmed ? 1 : 0;
    }
    if (group.current) {
      // smooth, no-clip tilt toward pointer (small angles)
      const dx = targetUV.current.x - 0.5;
      const dy = targetUV.current.y - 0.5;
      const rx = hovered ? -dy * 0.22 : 0;
      const ry = hovered ?  dx * 0.26 : 0;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, rx, 6, dt);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ry, 6, dt);
    }
  });

  return (
    <group
      ref={group}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (e.uv) targetUV.current.set(e.uv.x, e.uv.y);
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); targetUV.current.set(0.5, 0.5); }}
      onClick={(e) => { e.stopPropagation(); if (interactive) onClick?.(); }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#0b1220" metalness={0.15} roughness={0.65} />
        <holoMaterial ref={material} />
      </mesh>

      {/* Wireframe border above the card plane to avoid z-fighting */}
      <mesh position={[0, 0, 0.006]}>
        <shapeGeometry args={[(geometry as any).parameters.shapes]} />
        <meshBasicMaterial color="#b6c2cf" wireframe={true} transparent opacity={0.22} />
      </mesh>

      {/* Title / subtitle as canvas texture */}
      <group position={[0, height * 0.35, 0.008]}>
        <Label title={title} subtitle={subtitle} />
      </group>
    </group>
  );
}

function Label({ title, subtitle }: { title: string; subtitle?: string }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "700 44px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(title, 20, 50);
    if (subtitle) {
      ctx.fillStyle = "rgba(226,232,240,0.85)";
      ctx.font = "400 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(subtitle, 20, 96);
    }
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    return t;
  }, [title, subtitle]);

  return (
    <mesh>
      <planeGeometry args={[2.0, 0.9]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  );
}
