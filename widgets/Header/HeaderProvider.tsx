"use client";
import { motion } from "framer-motion";
type PropsHeader = {
  children: React.ReactNode;
};
export default function HeaderAnimation({ children }: PropsHeader) {
  return (
    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      {children}
    </motion.div>
  );
}
