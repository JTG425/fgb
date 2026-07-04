/* eslint-disable react/no-unknown-property, react/prop-types */
/*
 * 3D floating cinema props rendered behind the page content as gold
 * wireframe line art, matching the style of the site's outline icon
 * assets (film reels, tickets, masks, stars). The set of models changes
 * per route and everything slowly spins, drifts, and parallaxes with the
 * user's scroll. These replace the static decorative PNG icons the pages
 * used to position absolutely.
 *
 * Each model is a solid low-poly geometry reduced to its feature edges
 * (EdgesGeometry) and drawn with screen-space "fat lines" plus a very
 * faint gold fill for depth. Line brightness carries a baked gradient
 * and the material color oscillates over time for a gold shimmer.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import "../componentstyles/backgroundscene.css";

const CAMERA_Z = 11;

/* overall shrink factor applied on top of each item's own scale */
const SCENE_SCALE = 0.8;

/* the site's --gold */
const GOLD = "#c69866";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

/* clone a geometry with a position/rotation/scale applied, for merging.
   mergeGeometries requires uniform indexing, so de-index everything. */
function placed(geometry, { p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1] } = {}) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  g.applyMatrix4(
    new THREE.Matrix4().compose(
      new THREE.Vector3(...p),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...r)),
      new THREE.Vector3(...s)
    )
  );
  geometry.dispose();
  return g;
}

/*
 * Reduce a solid to its feature edges as a fat-line geometry. The 20°
 * threshold keeps smooth curve tessellation invisible while low-poly
 * facets (10-segment cylinders, icosahedrons) still draw their edges.
 * A brightness gradient is baked into vertex colors so the gold reads
 * as gilded rather than uniform.
 */
function buildWire(solid, threshold = 20) {
  const edges = new THREE.EdgesGeometry(solid, threshold);
  const positions = edges.attributes.position.array;
  const wire = new LineSegmentsGeometry();
  wire.setPositions(positions);

  const gradient = new Float32Array(positions.length / 3);
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < gradient.length; i++) {
    const v =
      positions[i * 3] * 0.45 + positions[i * 3 + 1] * 0.85 + positions[i * 3 + 2] * 0.25;
    gradient[i] = v;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = Math.max(max - min, 1e-5);
  const colors = new Float32Array(positions.length);
  for (let i = 0; i < gradient.length; i++) {
    const b = 0.7 + 0.55 * ((gradient[i] - min) / span);
    colors[i * 3] = b;
    colors[i * 3 + 1] = b;
    colors[i * 3 + 2] = b;
  }
  wire.setColors(colors);
  edges.dispose();
  return wire;
}

function finalize(solid) {
  return { solid, wire: buildWire(solid) };
}

/* ------------------------------------------------------------------ */
/* Model geometries                                                    */
/* ------------------------------------------------------------------ */

function ticketShape() {
  const w = 3.2;
  const h = 1.5;
  const r = 0.22;
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
  return shape;
}

function buildTicket() {
  const shape = ticketShape();
  /* perforation slots between stub and body */
  [-0.45, 0, 0.45].forEach((y) => {
    const slot = new THREE.Path();
    slot.moveTo(0.82, y - 0.1);
    slot.lineTo(0.89, y - 0.1);
    slot.lineTo(0.89, y + 0.1);
    slot.lineTo(0.82, y + 0.1);
    slot.closePath();
    shape.holes.push(slot);
  });
  const solid = new THREE.ExtrudeGeometry(shape, {
    depth: 0.09,
    bevelEnabled: false,
    curveSegments: 20,
  });
  solid.center();
  return finalize(solid);
}

function buildStar() {
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
  const solid = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
  solid.center();
  return finalize(solid);
}

function buildReel() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1, 0, Math.PI * 2, false);
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const hole = new THREE.Path();
    hole.absarc(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0.26, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const hub = new THREE.Path();
  hub.absarc(0, 0, 0.13, 0, Math.PI * 2, true);
  shape.holes.push(hub);
  const solid = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: false,
    curveSegments: 28,
  });
  solid.center();
  return finalize(solid);
}

function buildFilmstrip() {
  const w = 3.6;
  const h = 1.3;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2);
  shape.lineTo(w / 2, -h / 2);
  shape.lineTo(w / 2, h / 2);
  shape.lineTo(-w / 2, h / 2);
  shape.closePath();
  /* three frames */
  [-1.15, 0, 1.15].forEach((x) => {
    const frame = new THREE.Path();
    frame.moveTo(x - 0.44, -0.31);
    frame.lineTo(x + 0.44, -0.31);
    frame.lineTo(x + 0.44, 0.31);
    frame.lineTo(x - 0.44, 0.31);
    frame.closePath();
    shape.holes.push(frame);
  });
  /* two rows of sprocket holes */
  for (let i = 0; i < 10; i++) {
    const x = -1.53 + i * 0.34;
    [-0.5, 0.5].forEach((y) => {
      const hole = new THREE.Path();
      hole.moveTo(x - 0.07, y - 0.05);
      hole.lineTo(x + 0.07, y - 0.05);
      hole.lineTo(x + 0.07, y + 0.05);
      hole.lineTo(x - 0.07, y + 0.05);
      hole.closePath();
      shape.holes.push(hole);
    });
  }
  const solid = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
  solid.center();
  return finalize(solid);
}

function buildMask(happy) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, 0.72, 0.95, 0, Math.PI * 2, false, 0);
  [-0.3, 0.3].forEach((ex) => {
    const eye = new THREE.Path();
    eye.absellipse(ex, 0.3, 0.17, 0.11, 0, Math.PI * 2, true, 0);
    shape.holes.push(eye);
  });
  /* crescent mouth: smile opens down, frown opens up */
  const mouth = new THREE.Path();
  if (happy) {
    mouth.moveTo(-0.42, -0.25);
    mouth.absarc(0, 0.02, 0.5, Math.PI + 0.57, Math.PI * 2 - 0.57, false);
    mouth.quadraticCurveTo(0, -0.45, -0.42, -0.25);
  } else {
    mouth.moveTo(0.42, -0.35);
    mouth.absarc(0, -0.62, 0.5, 0.57, Math.PI - 0.57, false);
    mouth.quadraticCurveTo(0, -0.15, 0.42, -0.35);
  }
  mouth.closePath();
  shape.holes.push(mouth);
  const solid = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: false,
    curveSegments: 36,
  });
  solid.center();
  return finalize(solid);
}

function buildPopcorn() {
  const kernels = [
    { p: [0, 0.55, 0.05], k: 0.26 },
    { p: [0.3, 0.5, -0.1], k: 0.21 },
    { p: [-0.28, 0.48, 0.12], k: 0.22 },
    { p: [0.08, 0.72, -0.12], k: 0.18 },
    { p: [-0.1, 0.68, -0.02], k: 0.19 },
  ];
  const solid = mergeGeometries([
    placed(new THREE.CylinderGeometry(0.8, 0.55, 1.25, 10, 1), { p: [0, -0.15, 0] }),
    ...kernels.map(({ p, k }, i) =>
      placed(new THREE.IcosahedronGeometry(k, 0), { p, r: [i, i * 2, i * 0.5] })
    ),
  ]);
  return finalize(solid);
}

function buildSoda() {
  const solid = mergeGeometries([
    placed(new THREE.CylinderGeometry(0.5, 0.36, 1.15, 10, 1), { p: [0, -0.2, 0] }),
    placed(new THREE.CylinderGeometry(0.56, 0.56, 0.12, 10, 1), { p: [0, 0.43, 0] }),
    placed(new THREE.CylinderGeometry(0.05, 0.05, 0.85, 6, 1), {
      p: [0.18, 0.85, 0],
      r: [0, 0, -0.3],
    }),
  ]);
  return finalize(solid);
}

function buildCandy() {
  const solid = mergeGeometries([
    placed(new THREE.IcosahedronGeometry(0.48, 0), { s: [1.25, 1, 1] }),
    placed(new THREE.CylinderGeometry(0.09, 0.09, 0.14, 8, 1), {
      p: [0.62, 0, 0],
      r: [0, 0, Math.PI / 2],
    }),
    placed(new THREE.CylinderGeometry(0.09, 0.09, 0.14, 8, 1), {
      p: [-0.62, 0, 0],
      r: [0, 0, Math.PI / 2],
    }),
    /* twist ends flare outward, apex toward the body */
    placed(new THREE.ConeGeometry(0.28, 0.36, 8, 1), { p: [0.82, 0, 0], r: [0, 0, Math.PI / 2] }),
    placed(new THREE.ConeGeometry(0.28, 0.36, 8, 1), { p: [-0.82, 0, 0], r: [0, 0, -Math.PI / 2] }),
  ]);
  return finalize(solid);
}

const BUILDERS = {
  ticket: buildTicket,
  star: buildStar,
  reel: buildReel,
  filmstrip: buildFilmstrip,
  maskhappy: () => buildMask(true),
  masksad: () => buildMask(false),
  popcorn: buildPopcorn,
  soda: buildSoda,
  candy: buildCandy,
};

const geomCache = {};
function getGeoms(name) {
  if (!geomCache[name]) geomCache[name] = BUILDERS[name]();
  return geomCache[name];
}

/* ------------------------------------------------------------------ */
/* Wire model rendering                                                */
/* ------------------------------------------------------------------ */

const GOLD_COLOR = new THREE.Color(GOLD);

function WireModel({ model, phase = 0, reduced }) {
  const { solid, wire } = getGeoms(model);

  const material = useMemo(
    () =>
      new LineMaterial({
        color: GOLD,
        linewidth: 2.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  const size = useThree((state) => state.size);
  useEffect(() => {
    material.resolution.set(size.width, size.height);
  }, [material, size]);

  const lines = useMemo(() => {
    const l = new LineSegments2(wire, material);
    l.frustumCulled = false;
    l.renderOrder = 1;
    return l;
  }, [wire, material]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    /* gold shimmer: slow swell plus a faster glint, out of phase per model */
    const glint =
      1.08 + 0.2 * Math.sin(t * 1.3 + phase * 2.1) + 0.1 * Math.sin(t * 4.1 + phase * 1.3);
    material.color.copy(GOLD_COLOR).multiplyScalar(glint);
    material.opacity = 0.88 + 0.1 * Math.sin(t * 1.1 + phase * 1.6);
  });

  return (
    <group>
      <mesh geometry={solid}>
        <meshBasicMaterial color={GOLD} transparent opacity={0.035} depthWrite={false} />
      </mesh>
      <primitive object={lines} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Per-page prop sets                                                  */
/* fx / fy are fractions of the visible area (-0.5 .. 0.5)             */
/* ------------------------------------------------------------------ */

const VARIANTS = {
  home: [
    { model: "filmstrip", fx: -0.38, fy: 0.26, z: -1, scale: 1.05, spin: 0.22, dir: 1, parallax: 0.16, phase: 0.3, bank: 0.2 },
    { model: "ticket", fx: 0.4, fy: 0.3, z: -1.5, scale: 0.95, spin: 0.3, dir: -1, parallax: 0.12, phase: 1.4, bank: -0.3 },
    { model: "popcorn", fx: -0.4, fy: -0.28, z: -1, scale: 1.05, spin: 0.24, dir: 1, parallax: 0.18, phase: 2.1 },
    { model: "soda", fx: 0.39, fy: -0.26, z: -1, scale: 1.0, spin: 0.25, dir: -1, parallax: 0.2, phase: 2.9 },
    { model: "filmstrip", fx: 0.15, fy: -0.02, z: -5, scale: 1.1, spin: 0.16, dir: -1, parallax: 0.26, phase: 3.8, bank: -0.15 },
    { model: "candy", fx: -0.15, fy: 0.05, z: -5.5, scale: 0.8, spin: 0.3, dir: 1, parallax: 0.3, phase: 4.7, bank: 0.5 },
    { model: "reel", fx: 0.05, fy: 0.4, z: -6, scale: 0.7, spin: 0.2, dir: 1, parallax: 0.22, phase: 5.4 },
  ],
  tickets: [
    { model: "reel", fx: -0.4, fy: 0.28, z: -1, scale: 1.1, spin: 0.2, dir: 1, parallax: 0.15, phase: 0.6 },
    { model: "reel", fx: 0.42, fy: 0.05, z: -1.5, scale: 0.9, spin: 0.24, dir: -1, parallax: 0.2, phase: 1.9 },
    { model: "ticket", fx: -0.38, fy: -0.18, z: -1, scale: 1.1, spin: 0.28, dir: 1, parallax: 0.14, phase: 2.7, bank: 0.35 },
    { model: "ticket", fx: 0.38, fy: -0.35, z: -2, scale: 0.9, spin: 0.32, dir: -1, parallax: 0.18, phase: 3.4, bank: -0.4 },
    { model: "star", fx: 0.3, fy: 0.36, z: -3, scale: 0.6, spin: 0.38, dir: 1, parallax: 0.26, phase: 4.2 },
    { model: "star", fx: -0.2, fy: -0.4, z: -4, scale: 0.5, spin: 0.42, dir: -1, parallax: 0.3, phase: 5.0 },
    { model: "filmstrip", fx: 0.1, fy: 0.14, z: -6, scale: 1.0, spin: 0.16, dir: 1, parallax: 0.22, phase: 5.8, bank: 0.15 },
  ],
  locations: [
    { model: "maskhappy", fx: -0.14, fy: 0.38, z: -1.5, scale: 0.95, spin: 0.18, dir: 1, parallax: 0.14, phase: 0.9, bank: -0.25 },
    { model: "masksad", fx: 0.14, fy: 0.34, z: -2, scale: 0.95, spin: 0.18, dir: -1, parallax: 0.16, phase: 1.6, bank: 0.25 },
    { model: "star", fx: -0.12, fy: -0.4, z: -2, scale: 0.6, spin: 0.36, dir: -1, parallax: 0.24, phase: 2.4 },
    { model: "star", fx: 0.1, fy: -0.36, z: -2.5, scale: 0.45, spin: 0.4, dir: 1, parallax: 0.28, phase: 3.2 },
    { model: "reel", fx: -0.4, fy: -0.05, z: -1, scale: 0.9, spin: 0.2, dir: 1, parallax: 0.16, phase: 4.1 },
    { model: "ticket", fx: 0.4, fy: -0.1, z: -1.5, scale: 0.9, spin: 0.28, dir: -1, parallax: 0.14, phase: 4.9, bank: -0.3 },
  ],
  about: [
    { model: "reel", fx: 0.4, fy: 0.24, z: -1, scale: 1.0, spin: 0.2, dir: -1, parallax: 0.16, phase: 0.4 },
    { model: "filmstrip", fx: -0.4, fy: 0.28, z: -1, scale: 1.0, spin: 0.18, dir: 1, parallax: 0.18, phase: 1.2, bank: 0.2 },
    { model: "popcorn", fx: -0.38, fy: -0.3, z: -1.5, scale: 0.9, spin: 0.24, dir: 1, parallax: 0.18, phase: 2.3 },
    { model: "star", fx: 0.36, fy: -0.3, z: -2, scale: 0.6, spin: 0.36, dir: -1, parallax: 0.26, phase: 3.5 },
    { model: "candy", fx: 0.12, fy: 0.02, z: -5.5, scale: 0.8, spin: 0.3, dir: -1, parallax: 0.24, phase: 4.6, bank: -0.5 },
  ],
  rentals: [
    { model: "candy", fx: -0.4, fy: 0.26, z: -1, scale: 0.95, spin: 0.3, dir: 1, parallax: 0.14, phase: 0.7, bank: 0.5 },
    { model: "soda", fx: 0.4, fy: 0.22, z: -1, scale: 1.0, spin: 0.24, dir: -1, parallax: 0.18, phase: 1.8 },
    { model: "popcorn", fx: 0.36, fy: -0.3, z: -1.5, scale: 0.9, spin: 0.22, dir: 1, parallax: 0.2, phase: 2.9 },
    { model: "ticket", fx: -0.36, fy: -0.26, z: -1.5, scale: 0.95, spin: 0.28, dir: -1, parallax: 0.16, phase: 4.0, bank: 0.3 },
    { model: "star", fx: 0.05, fy: 0.05, z: -6, scale: 0.6, spin: 0.36, dir: 1, parallax: 0.26, phase: 5.2 },
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
    rotFactor = 0.0018,
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
    g.scale.setScalar(scale * SCENE_SCALE * sizeScale * appear.current);

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
          <ScrollDamper scrollData={scrollData} />
          <group key={variant}>
            {items.map((item, i) => (
              <FloatingModel key={`${item.model}-${i}`} config={item} scrollData={scrollData} reduced={reduced}>
                <WireModel model={item.model} phase={item.phase} reduced={reduced} />
              </FloatingModel>
            ))}
          </group>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

export default BackgroundScene;
