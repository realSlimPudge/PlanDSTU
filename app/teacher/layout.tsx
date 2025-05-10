"use client";
import { getRole } from "@/shared/functions/getRole";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = getRole();
    setIsTeacher(role === "Teacher");
    setIsLoading(false);
  }, []);

  const router = useRouter();

  if (isLoading) {
    return <div>Загрузка...</div>; // Или лоадер
  }

  if (!isTeacher) {
    return (
      <section className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              У вас нет прав для просмотра этой страницы
            </p>
            <button
              className="flex gap-1 items-center text-text-2-color"
              onClick={() => router.back()}
            >
              <ArrowLeft strokeWidth={2} size={20} />
              Назад
            </button>
          </div>
        </ListsAnimation>
      </section>
    );
  }

  return <div>{children}</div>;
}
