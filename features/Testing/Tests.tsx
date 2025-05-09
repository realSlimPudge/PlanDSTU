"use client";
import { AnimatePresence, motion } from "motion/react";
import { useSelectedNodes } from "../Roadmap/Nodes/SelectedNodesContext";
import { X } from "lucide-react";
import host from "@/shared/host";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/shared/api/getFetcher";
import { useEffect, useState } from "react";

type TestsProps = {
  open: boolean;
  closeAction: () => void;
};
type Status = {
  status: "active" | "retry" | "completed" | "pending";
};
//
export default function Tests({ open, closeAction }: TestsProps) {
  const { selectedNodes: themes } = useSelectedNodes();
  const { disciplineLink } = useParams<{ disciplineLink: string }>();

  const [taskId, setTaskId] = useState<string | null>(
    localStorage.getItem(`task_id-${disciplineLink}`),
  );

  const { data: testStatus } = useSWR<Status>(
    taskId ? `${host}/tests/status?task_id=${taskId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 1000,
    },
  );

  //Удаление из localstorage
  useEffect(() => {
    if (testStatus?.status === "completed") {
      localStorage.removeItem(`task_id-${disciplineLink}`);
      setTaskId(null);
    }
  }, [testStatus?.status]);

  const getTest = async () => {
    const body = { themes: themes };
    try {
      const res = await fetch(
        `${host}/tests/default-test?discipline_id=${disciplineLink}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) throw new Error("Попробуйте позже");
      const data = await res.json();
      localStorage.setItem(`task_id-${disciplineLink}`, data.task_id);
      setTaskId(localStorage.getItem(`task_id-${disciplineLink}`));
    } finally {
      console.log("jopa");
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="flex fixed inset-0 z-40 justify-center items-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 w-3/4 bg-white rounded-lg shadow-lg sm:w-2/5 dark:bg-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-text-color">
                Выбранные темы
              </h3>
              <button
                onClick={closeAction}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              <p className="mb-3 text-text-2-color">
                Запросить тестирование по следующим темам:
              </p>
              <ul className="mb-4 space-y-2">
                {themes.map((theme, i) => (
                  <li
                    key={i}
                    className="py-2 px-3 bg-gray-100 rounded-lg dark:text-gray-200 dark:bg-gray-700 text-text-color"
                  >
                    {theme}
                  </li>
                ))}
              </ul>
            </div>

            {taskId && testStatus ? (
              <div className="flex justify-end mt-6">
                {(testStatus.status === "active" ||
                  testStatus.status === "pending") && (
                  <div className="rounded-full border-2 animate-spin size-4 border-text-contrast-color border-b-transparent"></div>
                )}{" "}
                {testStatus.status === "completed" && <p>Завершено</p>}{" "}
              </div>
            ) : (
              <div className="flex justify-end mt-6">
                <button
                  disabled={themes.length < 1}
                  className="flex gap-x-2 justify-center items-center py-2 px-4 text-white rounded-md border cursor-pointer outline-none disabled:opacity-50 border-primary-color bg-primary-color hover:bg-primary-light-color"
                  onClick={getTest}
                >
                  Запросить тест
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
