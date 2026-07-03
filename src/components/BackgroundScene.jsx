/* eslint-disable react/no-unknown-property, react/prop-types */
/*
 * 3D floating cinema props (popcorn, tickets, soda, candy, stars, film reels)
 * rendered behind the page content. The set of models changes per route and
 * everything slowly spins, drifts, and parallaxes with the user's scroll.
 */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Context } from "../App";
import "../componentstyles/backgroundscene.css";

const CAMERA_Z = 11;

/* Matches the site palette: --gold, --primary, --primary-dark, and a warm cream */
const GOLD = "#c69866";
const RED = "#c21b17";
const RED_DARK = "#951512";
const CREAM = "#f3e9d7";

const MATERIAL = { roughness: 0.5, metalness: 0.05 };

/* soft same-color emissive keeps the shading close to the site's flat icons */
function Material({ color, ...rest }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.18}
      {...MATERIAL}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Shared geometries (built once, reused by every instance)            */
/* ------------------------------------------------------------------ */

let ticketGeometry = null;
function getTicketGeometry() {
  if (ticketGeometry) return ticketGeometry;
  const w = 3.2;
  const h = 1.5;
  const r = 0.18;
  const notch = 0.26;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, -notch);
  shape.absarc(w / 2, 0, notch, -Math.PI / 2, Math.PI / 2, true);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, notch);
  shape.absarc(-w / 2, 0, notch, Math.PI / 2, (3 * Math.PI) / 2, true);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  ticketGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 2,
    curveSegments: 12,
  });
  ticketGeometry.center();
  return ticketGeometry;
}

let starGeometry = null;
function getStarGeometry() {
  if (starGeometry) return starGeometry;
  const shape = new THREE.Shape();
  const points = 5;
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? 1 : 0.45;
    const angle = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  starGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    bevelSegments: 2,
  });
  starGeometry.center();
  return starGeometry;
}

let stripeTexture = null;
function getStripeTexture() {
  if (stripeTexture) return stripeTexture;
  const stripes = 20;
  const canvas = document.createElement("canvas");
  canvas.width = stripes * 12;
  canvas.height = 12;
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? RED : CREAM;
    ctx.fillRect(i * 12, 0, 12, 12);
  }
  stripeTexture = new THREE.CanvasTexture(canvas);
  stripeTexture.colorSpace = THREE.SRGBColorSpace;
  return stripeTexture;
}

/* ------------------------------------------------------------------ */
/* Models                                                              */
/* ------------------------------------------------------------------ */

function TicketModel({ color = GOLD }) {
  return (
    <group>
      <mesh geometry={getTicketGeometry()}>
        <Material color={color} />
      </mesh>
      {/* perforation line between stub and body */}
      <mesh position={[0.85, 0, 0]}>
        <boxGeometry args={[0.07, 1.56, 0.26]} />
        <Material color={CREAM} />
      </mesh>
    </group>
  );
}

function StarModel({ color = GOLD }) {
  return (
    <mesh geometry={getStarGeometry()}>
      <Material color={color} />
    </mesh>
  );
}

function ReelModel({ color = GOLD }) {
  const spokes = useMemo(() => [0, 1, 2, 3, 4].map((i) => (i * Math.PI * 2) / 5), []);
  return (
    <group>
      <mesh>
        <torusGeometry args={[1, 0.14, 12, 32]} />
        <Material color={color} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.32, 16]} />
        <Material color={RED_DARK} />
      </mesh>
      {spokes.map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0]}
          rotation={[0, 0, angle + Math.PI / 2]}
        >
          <boxGeometry args={[0.12, 0.85, 0.12]} />
          <Material color={color} />
        </mesh>
      ))}
    </group>
  );
}

const KERNELS = [
  [0, 0.14, 0],
  [0.34, 0.02, 0.14],
  [-0.32, 0, 0.2],
  [0.14, 0.04, -0.32],
  [-0.18, 0.06, -0.26],
  [0.3, -0.02, -0.2],
  [-0.36, 0, -0.02],
  [0.02, 0, 0.36],
];

function PopcornModel() {
  return (
    <group position={[0, -0.15, 0]}>
      <mesh>
        <cylinderGeometry args={[0.82, 0.56, 1.3, 28]} />
        <meshStandardMaterial map={getStripeTexture()} emissiveMap={getStripeTexture()} emissive="#ffffff" emissiveIntensity={0.18} {...MATERIAL} />
      </mesh>
      <mesh position={[0, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.07, 10, 28]} />
        <Material color={RED} />
      </mesh>
      <group position={[0, 0.78, 0]}>
        {KERNELS.map((pos, i) => (
          <mesh key={i} position={pos} rotation={[pos[0], pos[2] * 2, pos[1]]}>
            <icosahedronGeometry args={[0.2, 0]} />
            <Material color={i % 2 === 0 ? GOLD : CREAM} roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SodaModel() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.36, 1.2, 24]} />
        <Material color={RED} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.48, 0.44, 0.26, 24]} />
        <Material color={CREAM} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.12, 24]} />
        <Material color={CREAM} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
        <Material color={CREAM} />
      </mesh>
      <mesh position={[0.14, 1.05, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.045, 0.045, 0.75, 10]} />
        <Material color={GOLD} />
      </mesh>
    </group>
  );
}

function CandyModel({ color = GOLD }) {
  return (
    <group>
      <mesh scale={[1.25, 1, 1]}>
        <sphereGeometry args={[0.5, 20, 14]} />
        <Material color={color} />
      </mesh>
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.45, 12]} />
        <Material color={CREAM} />
      </mesh>
      <mesh position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.45, 12]} />
        <Material color={CREAM} />
      </mesh>
    </group>
  );
}

const MODELS = {
  ticket: TicketModel,
  star: StarModel,
  reel: ReelModel,
  popcorn: PopcornModel,
  soda: SodaModel,
  candy: CandyModel,
};

/* ------------------------------------------------------------------ */
/* Per-page prop sets                                                  */
/* fx / fy are fractions of the visible area (-0.5 .. 0.5)             */
/* ------------------------------------------------------------------ */

const VARIANTS = {
  home: [
    { model: "popcorn", fx: -0.38, fy: 0.22, z: -1, scale: 1.15, spin: 0.22, dir: 1, parallax: 0.16, phase: 0.3 },
    { model: "ticket", fx: 0.4, fy: 0.3, z: -1.5, scale: 0.95, spin: 0.3, dir: -1, parallax: 0.12, phase: 1.4, bank: -0.3 },
    { model: "soda", fx: 0.39, fy: -0.26, z: -1, scale: 1.05, spin: 0.25, dir: 1, parallax: 0.2, phase: 2.2 },
    { model: "candy", color: RED, fx: -0.4, fy: -0.3, z: -1.5, scale: 0.9, spin: 0.34, dir: -1, parallax: 0.1, phase: 3.1, bank: 0.55 },
    { model: "star", fx: 0.16, fy: 0.02, z: -5, scale: 0.55, spin: 0.4, dir: 1, parallax: 0.28, phase: 4.0 },
    { model: "reel", fx: -0.17, fy: -0.04, z: -5.5, scale: 0.7, spin: 0.18, dir: -1, parallax: 0.24, phase: 5.0 },
  ],
  tickets: [
    { model: "ticket", fx: -0.4, fy: 0.26, z: -1, scale: 1.2, spin: 0.26, dir: 1, parallax: 0.15, phase: 0.6, bank: 0.35 },
    { model: "ticket", color: RED, fx: 0.41, fy: -0.08, z: -1.5, scale: 0.95, spin: 0.32, dir: -1, parallax: 0.2, phase: 1.9, bank: -0.4 },
    { model: "star", fx: 0.36, fy: 0.32, z: -2, scale: 0.75, spin: 0.38, dir: 1, parallax: 0.26, phase: 2.7 },
    { model: "star", color: RED, fx: -0.3, fy: -0.33, z: -4, scale: 0.5, spin: 0.42, dir: -1, parallax: 0.3, phase: 3.8 },
    { model: "reel", fx: 0.12, fy: 0.06, z: -6, scale: 0.8, spin: 0.16, dir: 1, parallax: 0.22, phase: 4.6 },
    { model: "star", fx: -0.13, fy: 0.36, z: -5, scale: 0.4, spin: 0.35, dir: 1, parallax: 0.34, phase: 5.5 },
  ],
  locations: [
    { model: "reel", fx: -0.4, fy: 0.24, z: -1, scale: 1.0, spin: 0.2, dir: 1, parallax: 0.16, phase: 0.9 },
    { model: "star", fx: 0.4, fy: 0.28, z: -2, scale: 0.8, spin: 0.36, dir: -1, parallax: 0.24, phase: 1.7 },
    { model: "ticket", fx: 0.38, fy: -0.28, z: -1.5, scale: 0.9, spin: 0.28, dir: 1, parallax: 0.14, phase: 2.8, bank: -0.3 },
    { model: "popcorn", fx: -0.36, fy: -0.3, z: -2, scale: 0.85, spin: 0.22, dir: -1, parallax: 0.2, phase: 3.9 },
    { model: "star", color: RED, fx: 0.05, fy: 0.02, z: -6, scale: 0.5, spin: 0.4, dir: 1, parallax: 0.3, phase: 4.8 },
  ],
  about: [
    { model: "reel", fx: 0.4, fy: 0.24, z: -1, scale: 1.0, spin: 0.2, dir: -1, parallax: 0.16, phase: 0.4 },
    { model: "popcorn", fx: -0.39, fy: -0.28, z: -1.5, scale: 0.95, spin: 0.24, dir: 1, parallax: 0.18, phase: 1.5 },
    { model: "star", fx: -0.36, fy: 0.3, z: -2, scale: 0.7, spin: 0.36, dir: -1, parallax: 0.26, phase: 2.6 },
    { model: "ticket", fx: 0.1, fy: -0.06, z: -6, scale: 0.8, spin: 0.24, dir: 1, parallax: 0.22, phase: 3.7 },
    { model: "candy", fx: 0.38, fy: -0.3, z: -2, scale: 0.75, spin: 0.32, dir: -1, parallax: 0.12, phase: 4.9, bank: -0.5 },
  ],
  rentals: [
    { model: "candy", fx: -0.4, fy: 0.26, z: -1, scale: 1.0, spin: 0.3, dir: 1, parallax: 0.14, phase: 0.7, bank: 0.5 },
    { model: "soda", fx: 0.4, fy: 0.22, z: -1, scale: 1.0, spin: 0.24, dir: -1, parallax: 0.18, phase: 1.8 },
    { model: "star", fx: 0.34, fy: -0.28, z: -2, scale: 0.7, spin: 0.38, dir: 1, parallax: 0.26, phase: 2.9 },
    { model: "ticket", fx: -0.36, fy: -0.24, z: -1.5, scale: 0.9, spin: 0.28, dir: -1, parallax: 0.16, phase: 4.0, bank: 0.3 },
    { model: "popcorn", fx: 0.05, fy: 0.02, z: -6, scale: 0.8, spin: 0.2, dir: 1, parallax: 0.24, phase: 5.2 },
  ],
  admin: [],
};

function pathToVariant(pathname) {
  if (pathname.startsWith("/tickets")) return "tickets";
  if (pathname.startsWith("/locations")) return "locations";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/rentals")) return "rentals";
  if (pathname.startsWith("/admin")) return "admin";
  return "home";
}

/* ------------------------------------------------------------------ */
/* Animation                                                           */
/* ------------------------------------------------------------------ */

function ScrollDamper({ scrollData }) {
  useFrame((_, delta) => {
    const d = scrollData.current;
    d.smooth = THREE.MathUtils.damp(d.smooth, d.raw, 3.5, delta);
  });
  return null;
}

function FloatingModel({ config, scrollData, reduced, children }) {
  const group = useRef();
  const appear = useRef(0);
  const { viewport } = useThree();
  const {
    fx,
    fy,
    z = 0,
    scale = 1,
    spin = 0.25,
    dir = 1,
    rotFactor = 0.0022,
    parallax = 0.15,
    phase = 0,
    tilt = 0.3,
    bank = 0,
  } = config;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    /* frameloop is "demand" under reduced motion, so skip the entrance
       animation there — a damped value would freeze near zero */
    appear.current = reduced ? 1 : THREE.MathUtils.damp(appear.current, 1, 2.2, delta);
    const sizeScale = THREE.MathUtils.clamp(viewport.width / 10, 0.7, 1);
    g.scale.setScalar(scale * sizeScale * appear.current);

    /* everything further from the camera covers a larger world area,
       so scale placement fractions to keep screen positions consistent */
    const depthScale = (CAMERA_Z - z) / CAMERA_Z;
    const scrollWorld = scrollData.current.smooth * (viewport.height / window.innerHeight);
    const wrapRange = viewport.height * depthScale + 4.5;
    let y = fy * viewport.height * depthScale + (reduced ? 0 : scrollWorld * parallax);
    y = ((((y + wrapRange / 2) % wrapRange) + wrapRange) % wrapRange) - wrapRange / 2;

    g.position.set(
      fx * viewport.width * depthScale,
      y + (reduced ? 0 : Math.sin(t * 0.5 + phase) * 0.18),
      z
    );

    if (reduced) {
      g.rotation.set(tilt * 0.5, phase, bank);
    } else {
      g.rotation.y = phase + t * spin * dir + scrollData.current.smooth * rotFactor * dir;
      g.rotation.x = tilt * Math.sin(t * 0.35 + phase);
      g.rotation.z = bank + 0.12 * Math.cos(t * 0.28 + phase);
    }
  });

  return <group ref={group}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {}

  render() {
    /* WebGL unavailable: the page simply renders without the 3D background */
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function BackgroundScene() {
  const { pathname } = useLocation();
  const { theme } = useContext(Context);
  const scrollData = useRef({ raw: 0, smooth: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      scrollData.current.raw = window.scrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const variant = pathToVariant(pathname);
  const items = VARIANTS[variant] ?? VARIANTS.home;
  const dark = theme === "dark";

  if (items.length === 0) return null;

  return (
    <div className="background-scene" aria-hidden="true">
      <SceneErrorBoundary>
        <Canvas
          flat
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, CAMERA_Z], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          frameloop={reduced ? "demand" : "always"}
        >
          <ambientLight intensity={dark ? 0.9 : 1.05} />
          <directionalLight position={[4, 6, 8]} intensity={dark ? 1.5 : 1.7} />
          <directionalLight position={[-6, -3, 4]} intensity={0.5} color="#f6b2b0" />
          <ScrollDamper scrollData={scrollData} />
          <group key={variant}>
            {items.map((item, i) => {
              const Model = MODELS[item.model];
              return (
                <FloatingModel key={`${item.model}-${i}`} config={item} scrollData={scrollData} reduced={reduced}>
                  <Model color={item.color} />
                </FloatingModel>
              );
            })}
          </group>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

export default BackgroundScene;
