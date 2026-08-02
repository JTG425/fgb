import { forwardRef } from "react";
import { motion } from "motion/react";

export const BackgroundTransition = forwardRef(({ slide, transitionKey }, ref) => {
  const background = slide?.Background;
  const colorPalette = Array.isArray(background) ? background.slice(0, 5) : [];
  const hasColorPalette = colorPalette.length > 1;
  const hasBackgroundImage = typeof background === "string" && background.trim();

  const backgroundStyle = {
    backgroundImage: hasBackgroundImage
      ? background.trim().startsWith("url(")
        ? background.trim()
        : `url(${JSON.stringify(background.trim())})`
      : hasColorPalette
        ? `linear-gradient(75deg, ${colorPalette.join(", ")})`
        : "linear-gradient(75deg, #2b1616, #19191b 52%, #090a0b)",
  };

  return (
    <motion.div
      ref={ref}
      key={transitionKey}
      className="slideshow-background"
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={backgroundStyle}
      aria-hidden="true"
    >
      <div className="slideshow-background-overlay" />
    </motion.div>
  );
});

BackgroundTransition.displayName = "BackgroundTransition";

export default BackgroundTransition;
