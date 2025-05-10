"use client";
import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import { StatsTeacher } from "@/shared/typesForStats/types";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

export default function TeacherDetailPage() {
  const { disciplineName, groupName } = useParams<{
    disciplineName: string;
    groupName: string;
  }>();
  const router = useRouter();
  const { data, error, isLoading } = useSWR<StatsTeacher>(
    `${host}/teacher/reports/stats?discipline_name=${disciplineName}&group=${groupName}`,
    fetcher,
    { refreshInterval: 20000, revalidateOnFocus: true },
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen z-60">
        <ListsAnimation>
          <div className="w-10 h-10 rounded-full animate-spin border-3 border-primary-color border-b-transparent"></div>
        </ListsAnimation>
      </div>
    );
  }

  if (!data?.reports.length && !data?.stats.length) {
    return (
      <section className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              К сожалению данные отсутствуют
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
  const { reports, stats } = data;
  return (
    <section className="sm:w-[70%] w-[85%] mx-auto pt-40 pb-20">
      <ListsAnimation>
        <div className="p-6 rounded-lg">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              {reports[0].DisciplineTitle}
            </h1>
            <div className="flex gap-4 text-gray-600">
              <p>Группа: {reports[0].Group}</p>
              <p>
                Дата создания:{" "}
                {new Date(reports[0].CreatedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Средний балл</p>
              <p className="text-2xl font-bold text-blue-800">
                {stats[0]?.avg_score?.toFixed(2)}%
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Максимальный</p>
              <p className="text-2xl font-bold text-green-800">
                {stats[0]?.max_score}%
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600">Минимальный</p>
              <p className="text-2xl font-bold text-yellow-800">
                {stats[0]?.min_score}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Всего тестов</p>
              <p className="text-2xl font-bold text-purple-800">
                {stats[0]?.reports_count}
              </p>
            </div>
          </div>

          {/* Детализация тестов */}
          <div className="space-y-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              История прохождений
            </h2>

            {reports[0].DetailsJSONB.report.map((test, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border transition-colors hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm text-gray-500">
                    {new Date(test.PassedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <span className="py-1 px-3 text-sm text-indigo-800 bg-indigo-100 rounded-full">
                    Отчет {index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {test.ResultsJSONB.blocks.map((block, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-md border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">{block.name}</span>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            block.value >= 80
                              ? "bg-green-100 text-green-800"
                              : block.value >= 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {block.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            block.value >= 80
                              ? "bg-green-500"
                              : block.value >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${block.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="flex gap-1 items-center mt-6 text-text-2-color"
          onClick={() => router.back()}
        >
          <ArrowLeft strokeWidth={2} size={20} />
          Назад к списку
        </button>
      </ListsAnimation>
    </section>
  );
}
