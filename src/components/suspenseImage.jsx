import { motion } from "framer-motion";

const imgResourceCache = {};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = reject;
  });
}

function createResource(promise) {
  let status = "pending";
  let result;
  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    () => {
      status = "error";
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      }

      return status === "success" ? result : null;
    },
  };
}

function getImageResource(src) {
  if (!imgResourceCache[src]) {
    imgResourceCache[src] = createResource(loadImage(src));
  }
  return imgResourceCache[src];
}

export function SuspenseImage({ src, fallbackSrc, alt, ...props }) {
  const loadedSrc = src ? getImageResource(src).read() : null;

  return (
    <motion.img
      src={loadedSrc || fallbackSrc}
      alt={alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
    />
  );
}
