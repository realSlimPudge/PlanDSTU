"use client";
//TODO: отправку формы когда бекендер ебаный доделает
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { TestingProps, TestResponse } from "./types";
import QuestionCard from "./QuestionCard";
import host from "@/shared/host";
import fetcher from "@/shared/api/getFetcher";
import { useParams } from "next/navigation";

export default function Testing({ isOpen, onCloseAction }: TestingProps) {
  const { disciplineLink } = useParams<{ disciplineLink: string }>();
  const { data, isLoading } = useSWR<TestResponse>(
    `${host}/tests/first-test?discipline_id=${encodeURIComponent(disciplineLink)}`,
    fetcher,
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);

  // Мемоизируем вычисления, связанные с вопросами
  const {
    currentTheme,
    currentQuestion,
    progressText,
    totalQuestions,
    allAnswered,
  } = useMemo(() => {
    if (!data?.test) {
      return {
        currentTheme: null,
        currentQuestion: null,
        progressText: "",
        totalQuestions: 0,
        allAnswered: false,
      };
    }

    const themes = data.test;
    const themeLengths = themes.map((t) => t.questions.length);
    const total = themeLengths.reduce((sum, len) => sum + len, 0);

    const cumulative = themeLengths.reduce<number[]>(
      (acc, len) => [...acc, (acc[acc.length - 1] || 0) + len],
      [],
    );

    const themeIndex = cumulative.findIndex((cum) => cum > currentIndex);
    const prevCum = themeIndex > 0 ? cumulative[themeIndex - 1] : 0;
    const indexInTheme = currentIndex - prevCum;

    return {
      currentTheme: themes[themeIndex],
      currentQuestion: themes[themeIndex]?.questions[indexInTheme],
      progressText: `Вопрос ${indexInTheme + 1} из ${themes[themeIndex]?.questions.length}`,
      totalQuestions: total,
      allAnswered: answers.length === total && answers.every((a) => a !== null),
    };
  }, [data, currentIndex, answers]);

  // Инициализация ответов при загрузке данных
  useMemo(() => {
    if (data?.test && answers.length === 0) {
      const total = data.test.reduce((sum, t) => sum + t.questions.length, 0);
      setAnswers(Array(total).fill(null));
    }
  }, [data, answers.length]);

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

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    onCloseAction();
  };

  if (isLoading) return null;

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
            className="p-6 w-3/4 bg-white rounded-lg shadow-lg dark:bg-gray-800"
          >
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
                  disabled={!allAnswered}
                  className="py-2 px-4 text-white rounded-md disabled:opacity-50 bg-primary-color"
                >
                  Отправить
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
