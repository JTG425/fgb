import { motion } from 'framer-motion';
import React from 'react';

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
  let status = 'pending';
  let result;
  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else {
        return result;
      }
    },
  };
}

function getImageResource(src) {
  if (!imgResourceCache[src]) {
    imgResourceCache[src] = createResource(loadImage(src));
  }
  return imgResourceCache[src];
}

export function SuspenseImage({ src, alt, ...props }) {
  getImageResource(src).read();
  return (
  <motion.img 
    src={src} 
    alt={alt} 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    {...props} 
    />
  );
}
