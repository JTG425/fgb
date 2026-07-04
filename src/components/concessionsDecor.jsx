"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "../componentstyles/concessions.css";

/* Hand-drawn SVG concessions, tilted in 3D as the page scrolls.
   Purely decorative: fixed in the side gutters, behind all content,
   invisible to screen readers and pointer events. */

function PopcornBucket() {
  return (
    <svg viewBox="0 0 120 145" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="kernelLight" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFF8E8" />
          <stop offset="100%" stopColor="#E9C286" />
        </radialGradient>
        <radialGradient id="kernelDeep" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FBEDD2" />
          <stop offset="100%" stopColor="#D9A65E" />
        </radialGradient>
        <linearGradient id="bucketShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(40,10,5,0.35)" />
          <stop offset="25%" stopColor="rgba(40,10,5,0)" />
          <stop offset="75%" stopColor="rgba(40,10,5,0)" />
          <stop offset="100%" stopColor="rgba(40,10,5,0.35)" />
        </linearGradient>
      </defs>

      {/* popcorn mound */}
      <circle cx="38" cy="38" r="10" fill="url(#kernelDeep)" />
      <circle cx="82" cy="38" r="10" fill="url(#kernelDeep)" />
      <circle cx="60" cy="21" r="9" fill="url(#kernelDeep)" />
      <circle cx="52" cy="30" r="11" fill="url(#kernelLight)" />
      <circle cx="68" cy="32" r="11" fill="url(#kernelLight)" />
      <circle cx="30" cy="46" r="9" fill="url(#kernelLight)" />
      <circle cx="90" cy="46" r="8" fill="url(#kernelLight)" />
      <circle cx="46" cy="44" r="10" fill="url(#kernelDeep)" />
      <circle cx="74" cy="44" r="10" fill="url(#kernelLight)" />
      <circle cx="60" cy="40" r="12" fill="url(#kernelDeep)" />

      {/* bucket: cream base + red stripes */}
      <path d="M22,52 L98,52 L90,138 L30,138 Z" fill="#FBF1DE" />
      <path d="M22,52 L32.86,52 L38.57,138 L30,138 Z" fill="#A81613" />
      <path d="M43.71,52 L54.57,52 L55.71,138 L47.14,138 Z" fill="#A81613" />
      <path d="M65.43,52 L76.29,52 L72.86,138 L64.29,138 Z" fill="#A81613" />
      <path d="M87.14,52 L98,52 L90,138 L81.43,138 Z" fill="#A81613" />
      <path d="M22,52 L98,52 L90,138 L30,138 Z" fill="url(#bucketShade)" />

      {/* rim */}
      <path d="M19,44 L101,44 L99,56 L21,56 Z" fill="#F7E8CF" />
      <path d="M21,56 L99,56 L98.6,60 L21.4,60 Z" fill="rgba(60,20,10,0.18)" />
    </svg>
  );
}

function SodaCup() {
  return (
    <svg viewBox="0 0 100 155" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C21B17" />
          <stop offset="55%" stopColor="#951512" />
          <stop offset="100%" stopColor="#670F0D" />
        </linearGradient>
        <linearGradient id="cupShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(30,5,3,0.3)" />
          <stop offset="30%" stopColor="rgba(30,5,3,0)" />
          <stop offset="78%" stopColor="rgba(30,5,3,0)" />
          <stop offset="100%" stopColor="rgba(30,5,3,0.32)" />
        </linearGradient>
      </defs>

      {/* straw */}
      <path d="M56,3 L64,1 L72,38 L63,40 Z" fill="#A81613" />
      <path d="M58.5,3 L61,2.4 L68.6,39 L66,39.6 Z" fill="rgba(255,255,255,0.35)" />

      {/* lid */}
      <path d="M22,42 Q50,26 78,42 L79,50 L21,50 Z" fill="#F7E8CF" />
      <rect x="18" y="48" width="64" height="9" rx="3.5" fill="#EFDBBB" />
      <path d="M20,57 L80,57 L79.6,60 L20.4,60 Z" fill="rgba(60,20,10,0.18)" />

      {/* cup body */}
      <path d="M22,60 L78,60 L66,148 L34,148 Z" fill="url(#cupGrad)" />
      <path d="M27.5,95 Q50,85 72.5,95 L71.2,107 Q50,97 28.8,107 Z" fill="#C69866" />
      <path d="M30,64 L34.5,64 L30.5,142 L27.5,142 Z" fill="rgba(255,255,255,0.22)" />
      <path d="M22,60 L78,60 L66,148 L34,148 Z" fill="url(#cupShade)" />
    </svg>
  );
}

function CandyBox() {
  return (
    <svg viewBox="0 0 115 130" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="candyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B41915" />
          <stop offset="100%" stopColor="#7E110E" />
        </linearGradient>
      </defs>

      {/* open top + candies peeking out */}
      <rect x="30" y="26" width="60" height="28" fill="#5E0C0A" />
      <circle cx="45" cy="30" r="8" fill="#DEBD96" />
      <circle cx="59" cy="26" r="9" fill="#F7E8CF" />
      <circle cx="72" cy="31" r="8" fill="#C98F4F" />
      <circle cx="52" cy="36" r="7" fill="#E4A863" />

      {/* box: front + right side */}
      <path d="M95,42 L107,33 L107,104 L95,117 Z" fill="#650D0B" />
      <rect x="25" y="42" width="70" height="75" rx="5" fill="url(#candyGrad)" />
      <rect
        x="30.5"
        y="47.5"
        width="59"
        height="64"
        rx="3.5"
        fill="none"
        stroke="rgba(255,244,224,0.4)"
        strokeWidth="1.5"
      />

      {/* diagonal cream band + candy dots */}
      <path d="M25,86 L95,58 L95,73 L25,101 Z" fill="#F7E8CF" />
      <circle cx="42" cy="106" r="3.6" fill="#DEBD96" />
      <circle cx="56" cy="106" r="3.6" fill="#DEBD96" />
      <circle cx="70" cy="106" r="3.6" fill="#DEBD96" />
    </svg>
  );
}

function TicketStub() {
  return (
    <svg viewBox="0 0 150 70" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tickGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DEBD96" />
          <stop offset="100%" stopColor="#C08A50" />
        </linearGradient>
      </defs>
      <path
        d="M10,6 H140 Q144,6 144,10 V27 A8,8 0 0 0 144,43 V60 Q144,64 140,64 H10 Q6,64 6,60 V43 A8,8 0 0 0 6,27 V10 Q6,6 10,6 Z"
        fill="url(#tickGrad)"
        stroke="#A87F52"
        strokeWidth="1.5"
      />
      <rect
        x="16"
        y="13"
        width="118"
        height="44"
        rx="4"
        fill="none"
        stroke="rgba(255,248,235,0.8)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <text
        x="75"
        y="41"
        textAnchor="middle"
        fontFamily="var(--font-display), 'Arial Narrow', sans-serif"
        fontSize="17"
        letterSpacing="3.5"
        fill="#6E4B26"
      >
        ADMIT ONE
      </text>
    </svg>
  );
}

/* [start, end] transform ranges over the full page scroll — the ranges are
   intentionally small so the motion reads as ambient drift, not a show. */
const ITEMS = [
  {
    id: "popcorn",
    Art: PopcornBucket,
    slot: { left: "3vw", top: "16vh", width: "clamp(72px, 8vw, 118px)" },
    y: [30, -110],
    rotateX: [6, -10],
    rotateY: [-16, 14],
    rotateZ: [-7, 5],
    float: { duration: 7.5, delay: 0 },
  },
  {
    id: "ticket",
    Art: TicketStub,
    slot: { right: "2.5vw", top: "20vh", width: "clamp(96px, 10vw, 150px)" },
    y: [10, -130],
    rotateX: [-6, 10],
    rotateY: [18, -16],
    rotateZ: [10, -8],
    float: { duration: 8.5, delay: 1.2 },
  },
  {
    id: "soda",
    Art: SodaCup,
    slot: { right: "4vw", top: "58vh", width: "clamp(58px, 6.5vw, 92px)" },
    y: [50, -90],
    rotateX: [4, -8],
    rotateY: [20, -14],
    rotateZ: [7, -6],
    float: { duration: 6.8, delay: 0.6 },
  },
  {
    id: "candy",
    Art: CandyBox,
    slot: { left: "4vw", top: "66vh", width: "clamp(64px, 7vw, 102px)" },
    y: [70, -70],
    rotateX: [-5, 9],
    rotateY: [-14, 18],
    rotateZ: [-9, 7],
    float: { duration: 9, delay: 2 },
  },
];

function DecorItem({ progress, item }) {
  const { Art } = item;
  const y = useTransform(progress, [0, 1], item.y);
  const rotateX = useTransform(progress, [0, 1], item.rotateX);
  const rotateY = useTransform(progress, [0, 1], item.rotateY);
  const rotateZ = useTransform(progress, [0, 1], item.rotateZ);

  return (
    <div className="decor-slot" style={item.slot}>
      <motion.div
        className="decor-item"
        style={{ y, rotateX, rotateY, rotateZ }}
      >
        <div
          className="decor-float"
          style={{
            animationDuration: `${item.float.duration}s`,
            animationDelay: `${item.float.delay}s`,
          }}
        >
          <Art />
        </div>
      </motion.div>
    </div>
  );
}

export default function ConcessionsDecor() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // The spring makes the drift trail slightly behind the scroll, which is
  // what sells the "floating" feel without any per-frame JS of our own.
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 18,
    mass: 0.6,
  });

  return (
    <div className="concessions-decor" aria-hidden="true">
      {ITEMS.map((item) =>
        reduceMotion ? (
          <div key={item.id} className="decor-slot" style={item.slot}>
            <item.Art />
          </div>
        ) : (
          <DecorItem key={item.id} progress={progress} item={item} />
        )
      )}
    </div>
  );
}
