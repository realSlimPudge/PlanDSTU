"use client";

import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import ListSkeleton from "@/widgets/List/Skeleton/ListSkeleton";
import { ArrowLeft, MoveRight } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DisciplineTeacher = {
  disciplines: string[];
};

export default function TeacherPage() {
  const { data, error, isLoading } = useSWR<DisciplineTeacher>(
    `${host}/teacher/reports/disciplines`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    },
  );
  const router = useRouter();
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
            onClick={() => {
              router.back();
            }}
            className="flex justify-between items-center cursor-pointer text-text-color hover:text-text-2-color"
          >
            <>
              <ArrowLeft strokeWidth={2} size={20} />
              Назад
            </>
          </button>
          <h1 className="flex gap-x-2 items-center text-2xl font-medium sm:text-4xl justify-baseline text-start text-text-color">
            Доступные отчеты:
          </h1>
          {isLoading || !data ? (
            <ListSkeleton />
          ) : (
            <div className="flex flex-col gap-y-4">
              {data.disciplines.map((el, i) => (
                <Link href={`teacher/${el}`} key={i}>
                  <div className="flex flex-col gap-y-3 py-5 px-8 rounded-3xl bg-element-bg text-text-color group">
                    <h5 className="text-xl font-semibold transition-colors duration-200 ease group-hover:text-text-link-color">
                      {el}
                    </h5>
                    <p className="flex gap-x-2">
                      Перейти к направлению
                      <MoveRight strokeWidth={1} />{" "}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ListsAnimation>
    </section>
  );
}
