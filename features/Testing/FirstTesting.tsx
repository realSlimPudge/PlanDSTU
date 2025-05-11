"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { TestingProps } from "./types";
import QuestionCard from "./QuestionCard";
import host from "@/shared/host";
import { useParams } from "next/navigation";
import { useSelectedNodes } from "../Roadmap/Nodes/SelectedNodesContext";
import { useSWRConfig } from "swr";

export default function FirstTesting({
  isOpen,
  onCloseAction,
  test,
  testId,
  revalidateAction,
}: TestingProps) {
  const { mutate: mutateHistory } = useSWRConfig();
  //Проверка, есть ли тест
  const [haveTest, setHaveTest] = useState<boolean>(!!test);
  const { disciplineLink } = useParams<{ disciplineLink: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { allThemes } = useSelectedNodes();

  //Запрос теста
  const getFirstTest = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${host}/tests/first-test?discipline_id=${encodeURIComponent(disciplineLink)}`,
        {
          credentials: "include",
          body: JSON.stringify({ themes: allThemes }),
          method: "POST",
        },
      );
      const data = await res.json();
      setCurrentTestId(data.id);
      setCurrentTest(data.test);
    } finally {
      setIsLoading(false);
    }
  };

  //Загрузка при отправке ответов
  const [uploading, setUploading] = useState<boolean>(false);

  //Выбор данных либо с ответа либо с пропса
  const [currentTest, setCurrentTest] = useState(test || null);
  const [currentTestId, setCurrentTestId] = useState(testId || null);

  //Синхронизация testId с пропсом
  useEffect(() => {
    if (testId) {
      setCurrentTestId(testId);
    }
  }, [testId]);

  //синхронизация с пропсом
  useEffect(() => {
    if (test) setCurrentTest(test);
  }, [test]);

  useEffect(() => {
    if (currentTest) {
      setHaveTest(true);
    }
  }, [currentTest]);

  // Мемоизируем вычисления, связанные с вопросами
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);

  const {
    currentTheme,
    currentQuestion,
    progressText,
    totalQuestions,
    allAnswered,
  } = useMemo(() => {
    if (!currentTest) {
      return {
        currentTheme: null,
        currentQuestion: null,
        progressText: "",
        totalQuestions: 0,
        allAnswered: false,
      };
    }

    const themes = currentTest;
    const themeLengths = themes.map((t) => t.questions.length);
    const total = themeLengths.reduce((sum, len) => sum + len, 0);

    const cumulative = themeLengths.reduce<number[]>(
      (acc, len) => [...acc, (acc[acc.length - 1] || 0) + len],
      [],
    );

    const themeIndex = cumulative.findIndex((cum) => cum > currentIndex);
    const prevCum = themeIndex > 0 ? cumulative[themeIndex - 1] : 0;
    const indexInTheme = currentIndex - prevCum;
    const sumQuestions = themes.reduce(
      (cur, acc) => cur + acc.questions.length,
      0,
    );

    return {
      currentTheme: themes[themeIndex],
      currentQuestion: themes[themeIndex]?.questions[indexInTheme],
      progressText: `Вопрос ${indexInTheme + 1} из ${themes[themeIndex]?.questions.length}, всего вопросов: ${sumQuestions}`,
      totalQuestions: total,
      allAnswered: answers.length === total && answers.every((a) => a !== null),
    };
  }, [currentTest, currentIndex, answers]);

  // Инициализация ответов при загрузке данных
  useMemo(() => {
    if (currentTest && answers.length === 0) {
      const total = currentTest.reduce((sum, t) => sum + t.questions.length, 0);
      setAnswers(Array(total).fill(null));
    }
  }, [currentTest, answers.length]);

  const handleSelect = (label: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = label;
      return next;
    });
  };

  const goPrev = () => {
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  };

  const goNext = () => {
    setCurrentIndex((idx) => Math.min(totalQuestions - 1 || 0, idx + 1));
  };

  const submitAnswers = async () => {
    const body = { test_id: currentTestId, answers };
    try {
      setUploading(true);
      const res = await fetch(`${host}/tests/answers`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Попробуйте позже");
    } finally {
      setUploading(false);
      onCloseAction();
      revalidateAction();
      mutateHistory(`${host}/tests/my-history?discipline_id=${disciplineLink}`);
    }
  };

  const handleSubmit = () => {
    submitAnswers();
  };

  if (!isOpen) return null;
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
            className="p-6 py-4 w-3/4 bg-white rounded-lg shadow-lg sm:w-2/5 dark:bg-gray-800"
          >
            {!haveTest ? (
              <div className="flex relative flex-col gap-y-4 justify-between items-center">
                <p className="text-xl text-text-color hyphens-auto">
                  Для использования чата пройдите первичное тестирование
                </p>
                <div className="flex flex-col-reverse gap-x-2 gap-y-2 justify-between items-center sm:justify-center md:flex-row">
                  <button
                    onClick={onCloseAction}
                    className="py-2 px-4 text-gray-700 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
                    aria-label="Закрыть"
                  >
                    Закрыть
                  </button>
                  <button
                    className="flex gap-x-2 justify-between items-center py-2 px-4 text-white rounded-md border cursor-pointer outline-none disabled:opacity-50 border-primary-color bg-primary-color hover:bg-primary-light-color"
                    onClick={getFirstTest}
                  >
                    {isLoading && (
                      <div className="rounded-full border-2 animate-spin w-[10px] h-[10px] border-text-contrast-color border-b-transparent"></div>
                    )}
                    Запросить тестирование
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-text-color">
                      {currentTheme?.title || "Загрузка..."}
                    </h3>
                    <span className="text-text-2-color">{progressText}</span>
                  </div>
                  <button
                    onClick={onCloseAction}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Закрыть"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {currentQuestion ? (
                  <QuestionCard
                    question={currentQuestion}
                    selected={answers[currentIndex]}
                    onSelect={handleSelect}
                  />
                ) : (
                  <div className="text-red-500">Вопрос не найден</div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="py-2 px-4 text-gray-700 rounded-lg border border-gray-300 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
                  >
                    Назад
                  </button>
                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={goNext}
                      disabled={!answers[currentIndex]}
                      className="py-2 px-4 text-white rounded-md disabled:opacity-50 bg-primary-color"
                    >
                      Вперед
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!allAnswered || uploading}
                      className="flex gap-x-2 justify-between items-center py-2 px-4 text-white rounded-md disabled:opacity-50 bg-primary-color"
                    >
                      {uploading && (
                        <div className="rounded-full border-2 animate-spin w-[10px] h-[10px] border-text-contrast-color border-b-transparent"></div>
                      )}
                      Отправить
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
