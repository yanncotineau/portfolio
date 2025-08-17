"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Text } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import HoloCard from "./HoloCard";

type Card = { title: string; subtitle?: string; imageUrl?: string };
type Category = { name: string; cards: Card[] };

/** Sizes & spacing (no overlap) */
const CARD_W = 2.6;
const CARD_H = 3.6;
const H_SPACING = 3.8;   // horizontal gap between card centers
const V_SPACING = 5.6;   // vertical gap between row centers
const ROW_YAW   = -0.18; // slight row tilt for depth

/** Fixed camera (direction never changes) */
const CAMERA_POS  = new THREE.Vector3(-3.0, 2.6, 8.2);
const CAMERA_EUL  = new THREE.Euler(-0.18, -0.26, 0);
const CAMERA_QUAT = new THREE.Quaternion().setFromEuler(CAMERA_EUL);

export default function SkillsScene({
  categories,
  activeCategory,
  activeCard,
  onSelect,
  readOnly = false,
}: {
  categories: Category[];
  activeCategory: number;
  activeCard: number;
  onSelect?: (c: Card) => void;
  readOnly?: boolean;
}) {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
      <Rig />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#444" />
        <directionalLight position={[2, 3, 2]} intensity={1.2} />
        <fog attach="fog" args={["#0b0e1a", 7, 18]} />

        {/* Stack = all rows. We move its Y to center the active category. */}
        <Stack
          categories={categories}
          activeCategory={activeCategory}
          activeCard={activeCard}
          onSelect={onSelect}
          readOnly={readOnly}
        />
      </Suspense>
    </Canvas>
  );
}

/** Camera is fixed; never rotates. */
function Rig() {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  useFrame(() => {
    if (!cam.current) return;
    cam.current.position.copy(CAMERA_POS);
    cam.current.quaternion.copy(CAMERA_QUAT);
  });
  return <PerspectiveCamera ref={cam} makeDefault fov={42} near={0.1} far={100} position={CAMERA_POS} quaternion={CAMERA_QUAT} />;
}

/** Renders all rows; slides the whole stack vertically to bring the active row to center. */
function Stack({
  categories,
  activeCategory,
  activeCard,
  onSelect,
  readOnly,
}: {
  categories: Category[];
  activeCategory: number;
  activeCard: number;
  onSelect?: (c: Card) => void;
  readOnly?: boolean;
}) {
  const stack = useRef<THREE.Group>(null);

  useFrame((_s, dt) => {
    if (!stack.current) return;
    // move DOWN in world-space as category index increases
    const targetY = activeCategory * V_SPACING;
    stack.current.position.y = THREE.MathUtils.damp(stack.current.position.y, targetY, 4, dt);
  });

  return (
    <group ref={stack}>
      {categories.map((cat, ci) => (
        <CategoryRow
          key={cat.name + ci}
          name={cat.name}
          y={-ci * V_SPACING}
          cardOffset={ci === activeCategory ? -activeCard * H_SPACING : 0}
          cards={cat.cards}
          dimmed={ci !== activeCategory}
          onSelect={onSelect}
          readOnly={readOnly}
        />
      ))}
    </group>
  );
}

/** One row: fixed 3D title + a sliding group of cards. */
function CategoryRow({
  name,
  y,
  cardOffset,
  cards,
  dimmed,
  onSelect,
  readOnly,
}: {
  name: string;
  y: number;
  cardOffset: number; // X offset for the cards group (slides with left/right)
  cards: Card[];
  dimmed: boolean;
  onSelect?: (c: Card) => void;
  readOnly?: boolean;
}) {
  const cardsGroup = useRef<THREE.Group>(null);

  useFrame((_s, dt) => {
    if (!cardsGroup.current) return;
    cardsGroup.current.position.x = THREE.MathUtils.damp(cardsGroup.current.position.x, cardOffset, 4, dt);
  });

  return (
    <group position={[0, y, 0]} rotation={[0, ROW_YAW, 0]}>
      {/* Fixed row title (doesn't move when cards slide) */}
      <Text
        position={[-H_SPACING * 1.5, 2.4, 0]}
        fontSize={0.32}
        color="#cbd5e1"
        anchorX="left"
        anchorY="middle"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 /-"
      >
        {name}
      </Text>

      {/* Cards that slide as a unit */}
      <group ref={cardsGroup}>
        {cards.map((c, i) => (
          <group key={c.title + i} position={[i * H_SPACING, 0, 0]}>
            <HoloCard
              width={CARD_W}
              height={CARD_H}
              title={c.title}
              subtitle={c.subtitle}
              onClick={readOnly ? undefined : () => onSelect?.(c)}
              interactive={!readOnly}
              dimmed={dimmed}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
