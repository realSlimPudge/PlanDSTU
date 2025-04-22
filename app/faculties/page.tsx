"use client";

import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import ListFaculties from "@/widgets/List/ListFaculties";
import ListSkeleton from "@/widgets/List/Skeleton/ListSkeleton";
import { Faculty } from "@/widgets/List/Types/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function FacultiesPage() {
  const router = useRouter();

  const {
    data: faculties,
    error,
    isLoading,
  } = useSWR<{ data: Faculty[] }>(`${host}/parser/faculties`, fetcher);

  if (error) {
    return (
      <section className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              Ошибка загрузки данных. Попробуйте позже.
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

  return (
    <section className="sm:w-[70%] w-[85%] mx-auto pt-40 pb-20">
      <ListsAnimation>
        <div className="space-y-3">
          <h1 className="text-2xl font-medium sm:text-4xl text-text-color">
            Список факультетов:{" "}
          </h1>
          {isLoading || !faculties ? (
            <ListSkeleton />
          ) : (
            <ListFaculties data={faculties.data} />
          )}
        </div>
      </ListsAnimation>
    </section>
  );
}
