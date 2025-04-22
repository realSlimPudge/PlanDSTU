"use client";
import { motion } from "framer-motion";

type ListAnimationProps = {
  children: React.ReactNode;
};
export default function ListsAnimation({ children }: ListAnimationProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
}
