"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="flex flex-col items-center sm:w-[70%] justify-center w-[85%] mx-auto h-screen">
      <div className="flex flex-col gap-y-5 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0 }}
        >
          <Image
            src="/95donstu.png"
            alt="ДГТУ 95 лет"
            width={250}
            height={250}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-semibold text-center sm:text-9xl text-text-color">
            PlanDSTU
          </h1>
          <p className="text-center text-text-2-color">
            Нейросеть и карта обучения для студентов
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-x-2 items-center"
        >
          <Link
            href="teacher"
            className="flex gap-x-2 items-center py-4 px-3 text-xl bg-transparent rounded-xl border transition duration-300 border-gray-color-1 text-text-color w-fit ease hover:bg-gray-color-1"
          >
            Преподавателям
          </Link>
          <Link
            href="faculties"
            className="flex gap-x-2 items-center py-4 px-3 text-xl rounded-xl transition duration-300 ease bg-primary-color text-text-contrast-color w-fit hover:bg-primary-light-color"
          >
            Начать <ArrowRight size={22} />{" "}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
