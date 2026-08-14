"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { JSX, useEffect, useRef } from "react";

export default function AnimatedBox({ children }: { children: JSX.Element }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  const sideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      sideControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative overflow-hidden w-fit inline">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}>
        {children}
      </motion.div>
      <motion.div
        className="absolute w-full h-full bg-secondary/75 top-1 bottom-1 left-0 right-0"
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={sideControls}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
