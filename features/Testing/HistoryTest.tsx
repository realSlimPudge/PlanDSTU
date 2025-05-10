//ToDo: обработать пустую историю и сделать ревалидацию после отправки
import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { TestHistory } from "./types";
import { X } from "lucide-react";
import { useState } from "react";

type HistoryProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export default function HistoryTest({ isOpen, onCloseAction }: HistoryProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const { disciplineLink, disciplineName } = useParams<{
    disciplineLink: string;
    disciplineName: string;
  }>();
  const { data } = useSWR<TestHistory>(
    `${host}/tests/my-history?discipline_id=${disciplineLink}`,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 0 },
  );

  const getColorByScore = (score: number) => {
    if (score >= 99) return "bg-green-300 text-green-800";
    if (score >= 66) return "bg-yellow-300 text-yellow-800";
    return "bg-red-300 text-red-800";
  };

  const sendHistory = async () => {
    try {
      setUploading(true);
      const res = await fetch(
        `${host}/report/create?discipline_id=${disciplineLink}&discipline_name=${disciplineName}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Попробуйте позже");
    } finally {
      setUploading(false);
      onCloseAction();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="flex flex-col p-6 w-3/4 bg-white rounded-lg shadow-lg sm:w-2/5 dark:bg-gray-800 max-h-[80vh]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-text-color">
                История тестирований
              </h3>
              <button
                onClick={onCloseAction}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {data?.history.map((test, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(test.PassedAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {test.ResultsJSONB.blocks.map((block, blockIndex) => (
                      <div
                        key={blockIndex}
                        className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-text-color">{block.name}</span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${getColorByScore(
                              block.value,
                            )}`}
                          >
                            {block.value.toFixed(1)}%
                          </span>
                        </div>

                        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600">
                          <div
                            className={`${getColorByScore(
                              block.value,
                            )} h-2 rounded-full`}
                            style={{ width: `${block.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 mt-4">
              <button
                onClick={sendHistory}
                disabled={uploading}
                className="flex gap-x-2 justify-between items-center py-2 px-4 text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-default bg-primary-color"
              >
                {uploading && (
                  <div className="rounded-full border-2 animate-spin w-[10px] h-[10px] border-text-contrast-color border-b-transparent"></div>
                )}
                Отправить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
