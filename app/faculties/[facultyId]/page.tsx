"use client";

import fetcher from "@/shared/api/getFetcher";
import { Skeleton } from "@/shared/components/ui/skeleton";
import host from "@/shared/host";
import ListDirections from "@/widgets/List/ListDirections";
import ListSkeleton from "@/widgets/List/Skeleton/ListSkeleton";
import { FacultyInfo } from "@/widgets/List/Types/types";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

export default function FacultyPage() {
  const { facultyId } = useParams<{ facultyId: string }>();
  const router = useRouter();

  const {
    data: facultyInfo,
    error,
    isLoading,
  } = useSWR<FacultyInfo>(`${host}/parser/faculties/${facultyId}`, fetcher);

  if (error) {
    return (
      <section className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
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
      </section>
    );
  }

  return (
    <section className="sm:w-[70%] w-[85%] mx-auto pt-40 pb-20">
      <div className="space-y-3">
        <button
          className="flex justify-between items-center cursor-pointer text-text-color hover:text-text-2-color"
          onClick={() => {
            router.back();
          }}
        >
          <>
            <ArrowLeft strokeWidth={2} size={20} />
            Список факультетов
          </>
        </button>
        <h1 className="flex gap-x-2 items-center text-2xl font-medium sm:text-4xl justify-baseline text-start text-text-color">
          Направления{" "}
          {isLoading || !facultyInfo ? (
            <Skeleton className="text-4xl bg-gray-color-2 w-[90px] h-[40px]" />
          ) : (
            <span className="font-bold">
              {facultyInfo.title}
              {": "}
            </span>
          )}
        </h1>
        {isLoading || !facultyInfo ? (
          <ListSkeleton />
        ) : (
          <ListDirections data={facultyInfo.directions} />
        )}
      </div>
    </section>
  );
}
