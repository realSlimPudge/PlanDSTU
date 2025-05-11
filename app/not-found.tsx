"use client";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center w-screen h-screen z-60">
      <ListsAnimation>
        <div className="flex flex-col justify-center items-center text-center">
          <h2 className="text-9xl font-bold text-text-link-color">404</h2>
          <p className="text-2xl text-text-color">Страница не найдена</p>
          <button
            className="flex gap-1 justify-center items-center mt-2 cursor-pointer group text-text-2-color hover:text-text-color"
            onClick={() => router.back()}
          >
            <ArrowLeft strokeWidth={2} size={20} />
            Назад
          </button>
        </div>
      </ListsAnimation>
    </div>
  );
}
