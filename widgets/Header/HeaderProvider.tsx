"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
type PropsHeader = {
  children: React.ReactNode;
};
export default function HeaderAnimation({ children }: PropsHeader) {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div
      className={`z-40 fixed w-screen duration-300 ease transition-all ${visible ? "translate-y-0" : "translate-y-[-70px]"}`}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
