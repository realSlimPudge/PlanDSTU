"use client";

import fetcher from "@/shared/api/getFetcher";
import { Skeleton } from "@/shared/components/ui/skeleton";
import host from "@/shared/host";
import ListDirections from "@/widgets/List/ListDirections";
import ListSkeleton from "@/widgets/List/Skeleton/ListSkeleton";
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
  } = useSWR(`${host}/parser/faculties/${facultyId}`, fetcher);

  console.log(error);

  return (
    <section className="w-[70%] mx-auto pt-40 pb-20">
      <div className="space-y-3">
        <button
          className="flex justify-between items-center cursor-pointer text-text-color hover:text-text-2-color"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft strokeWidth={2} size={20} />
          Назад
        </button>
        <h1 className="flex gap-x-2 items-center text-4xl font-medium justify-baseline text-start text-text-color">
          Факультет:{" "}
          {isLoading ? (
            <Skeleton className="text-4xl bg-gray-color-2 w-[90px] h-[40px]" />
          ) : (
            <span className="font-bold">{facultyInfo.title}</span>
          )}
        </h1>
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <ListDirections data={facultyInfo.directions} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
}
