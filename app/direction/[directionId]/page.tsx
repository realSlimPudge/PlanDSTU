"use client";

import fetcher from "@/shared/api/getFetcher";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import host from "@/shared/host";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import ListDisciplines from "@/widgets/List/ListDisciplines";
import ListSkeleton from "@/widgets/List/Skeleton/ListSkeleton";
import { Discipline } from "@/widgets/List/Types/types";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function DirectionPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { directionId } = useParams<{ directionId: string }>();
  const decoded = decodeURIComponent(directionId);
  const router = useRouter();

  const {
    data: disciplines,
    error,
    isLoading,
  } = useSWR<Discipline[]>(`${host}/parser/disciplines/${decoded}`, fetcher);

  const sortedDiscipline = useMemo(() => {
    if (!disciplines) return [];

    const arr = [...disciplines];
    return arr.sort((a, b) => {
      const semA = +a.semester;
      const semB = +b.semester;
      return sortOrder === "asc" ? semA - semB : semB - semA;
    });
  }, [disciplines, sortOrder]);

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
          <button
            className="flex justify-between items-center cursor-pointer text-text-color hover:text-text-2-color"
            onClick={() => {
              router.back();
            }}
          >
            <>
              <ArrowLeft strokeWidth={2} size={20} />
              Список направлений
            </>
          </button>
          <h1 className="flex gap-x-2 items-center text-2xl font-medium sm:text-4xl justify-baseline text-start text-text-color">
            Дисциплины
            <span className="font-bold">
              {decoded}
              {": "}
            </span>
          </h1>
          <Select
            value={sortOrder}
            onValueChange={(e) => setSortOrder(e === "asc" ? "asc" : "desc")}
          >
            <SelectTrigger className="border-0 transition-colors duration-300 ease text-text-color bg-gray-color-3 dark:bg-gray-color-3 hover:bg-gray-color-2">
              <SelectValue
                placeholder="Сортировка"
                className="placeholder:text-text-2-color"
              />
            </SelectTrigger>
            <SelectContent className="border-0 bg-gray-color-3">
              <SelectGroup className="bg-gray-color-3 text-text-2-color">
                <SelectLabel>Семестр</SelectLabel>
                <SelectItem
                  value="asc"
                  className="bg-gray-color-3 hover:bg-gray-color-2"
                >
                  От меньшего
                </SelectItem>
                <SelectItem value="desc">От большего</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {isLoading || !disciplines ? (
            <ListSkeleton />
          ) : (
            <ListDisciplines data={sortedDiscipline} />
          )}
        </div>
      </ListsAnimation>
    </section>
  );
}
