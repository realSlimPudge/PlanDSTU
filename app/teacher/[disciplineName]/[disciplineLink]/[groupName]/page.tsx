"use client";
import { motion } from "framer-motion";
import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import { StatsTeacher } from "@/shared/typesForStats/types";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";

export default function TeacherDetailPage() {
  const { disciplineName, groupName } = useParams<{
    disciplineName: string;
    groupName: string;
  }>();
  const router = useRouter();
  const { data, error, isLoading } = useSWR<StatsTeacher>(
    `${host}/teacher/reports/stats?discipline_name=${disciplineName}&group=${groupName}`,
    fetcher,
    { refreshInterval: 0, revalidateOnFocus: false },
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

  if (!data?.reports.length && !data?.stats) {
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
            <div className="flex flex-col gap-x-2 mb-2">
              <h1 className="mb-2 text-3xl font-bold text-text-color">
                {reports[0].DisciplineTitle}
              </h1>
              <div className="flex flex-col gap-x-2 gap-y-2 md:flex-row">
                <Link
                  href={`${groupName}/test-detail`}
                  className="flex gap-x-2 items-center p-2 px-3 rounded-xl transition duration-300 bg-primary-color text-text-contrast-color ease hover:bg-primary-light-color"
                >
                  Просмотреть тесты{" "}
                </Link>
                <Link
                  href={`${groupName}/add-test`}
                  className="flex gap-x-2 items-center p-2 px-3 rounded-xl transition duration-300 bg-primary-color text-text-contrast-color ease hover:bg-primary-light-color"
                >
                  Добавить тесты <Plus />{" "}
                </Link>
              </div>
            </div>
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
            <div className="p-4 rounded-lg shadow-md bg-element-bg">
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Средний балл
              </p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                {stats?.avg_score?.toFixed(2)}%
              </p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-element-bg">
              <p className="text-sm text-green-600 dark:text-green-300">
                Максимальный
              </p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-400">
                {stats?.max_score}%
              </p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-element-bg">
              <p className="text-sm text-yellow-600 dark:text-yellow-200">
                Минимальный
              </p>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-400">
                {stats?.min_score}%
              </p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-element-bg">
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Всего тестов
              </p>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-400">
                {stats?.reports_count}
              </p>
            </div>
          </div>

          {/* Детализация тестов */}
          <div className="space-y-6">
            <h2 className="mb-4 text-xl font-semibold text-text-color">
              История прохождений
            </h2>

            {reports[0].DetailsJSONB.report.map((test, index) => (
              <div key={index} className="p-0 rounded-lg transition-colors">
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
                  <span className="py-1 px-3 text-sm text-indigo-800 bg-indigo-100 rounded-full dark:text-indigo-100 dark:bg-indigo-800">
                    Отчет {index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {test.ResultsJSONB.blocks.map((block, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md shadow-md bg-element-bg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-color">{block.name}</span>
                        <span
                          className={`px-2 py-1 rounded text-sm ${block.value >= 80
                              ? "bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100"
                              : block.value >= 50
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-500 dark:text-red-100"
                            }`}
                        >
                          {block.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-element-bg-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${block.value}%` }}
                          transition={{ delay: 0.1 }}
                          className={`h-2 rounded-full ${block.value >= 80
                              ? "bg-green-500"
                              : block.value >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
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
