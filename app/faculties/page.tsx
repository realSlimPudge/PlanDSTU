"use client";

import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import ListFaculties from "@/widgets/List/ListFaculties";
import ListSkeleton from "@/widgets/List/Skeleton/ListSkeleton";
import useSWR from "swr";

export default function FacultiesPage() {
  const {
    data: faculties,
    error,
    isLoading,
  } = useSWR(`${host}/parser/faculties`, fetcher);

  console.log(error);

  return (
    <section className="w-[70%] mx-auto pt-40 pb-20">
      <div className="space-y-3">
        <h1 className="text-4xl font-medium text-text-color">
          Список факультетов:{" "}
        </h1>
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <ListFaculties data={faculties.data} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
}
