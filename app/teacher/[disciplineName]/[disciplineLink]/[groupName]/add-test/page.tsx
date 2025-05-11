"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash, ArrowLeft } from "lucide-react";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import host from "@/shared/host";

interface Option {
  label: string;
  text: string;
}

interface Question {
  text: string;
  options: Option[];
  correctAnswer: string;
}

interface Test {
  title: string;
  questions: Question[];
}

export default function AddTestPage() {
  const { disciplineLink } = useParams<{ disciplineLink: string }>();
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([{ title: "", questions: [] }]);

  const addTest = () => {
    setTests([...tests, { title: "", questions: [] }]);
  };

  const updateTestTitle = (index: number, title: string) => {
    const newTests = [...tests];
    newTests[index].title = title;
    setTests(newTests);
  };

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const addQuestion = (testIndex: number) => {
    const newTests = [...tests];
    newTests[testIndex].questions.push({
      text: "",
      options: [{ label: "A", text: "" }],
      correctAnswer: "",
    });
    setTests(newTests);
  };

  const updateQuestion = (
    testIndex: number,
    questionIndex: number,
    text: string,
  ) => {
    const newTests = [...tests];
    newTests[testIndex].questions[questionIndex].text = text;
    setTests(newTests);
  };

  const removeQuestion = (testIndex: number, questionIndex: number) => {
    const newTests = [...tests];
    newTests[testIndex].questions = newTests[testIndex].questions.filter(
      (_, i) => i !== questionIndex,
    );
    setTests(newTests);
  };

  const addOption = (testIndex: number, questionIndex: number) => {
    const newTests = [...tests];
    const question = newTests[testIndex].questions[questionIndex];
    const nextLabel = String.fromCharCode(question.options.length + 65);
    question.options.push({ label: nextLabel, text: "" });
    setTests(newTests);
  };

  const updateOption = (
    testIndex: number,
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) => {
    const newTests = [...tests];
    newTests[testIndex].questions[questionIndex].options[optionIndex].text =
      text;
    setTests(newTests);
  };

  const removeOption = (
    testIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const newTests = [...tests];
    newTests[testIndex].questions[questionIndex].options = newTests[
      testIndex
    ].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setTests(newTests);
  };

  const setCorrectAnswer = (
    testIndex: number,
    questionIndex: number,
    label: string,
  ) => {
    const newTests = [...tests];
    newTests[testIndex].questions[questionIndex].correctAnswer = label;
    setTests(newTests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    let isValid = true;
    tests.forEach((test, testIndex) => {
      if (!test.title.trim()) {
        alert(`Тест ${testIndex + 1}: Введите название темы`);
        isValid = false;
      }
      test.questions.forEach((question, qIndex) => {
        if (!question.text.trim()) {
          alert(
            `Тест ${testIndex + 1}, вопрос ${qIndex + 1}: Введите текст вопроса`,
          );
          isValid = false;
        }
        if (question.options.length < 2) {
          alert(
            `Тест ${testIndex + 1}, вопрос ${qIndex + 1}: Добавьте минимум 2 варианта`,
          );
          isValid = false;
        }
        question.options.forEach((option, oIndex) => {
          if (!option.text.trim()) {
            alert(
              `Тест ${testIndex + 1}, вопрос ${qIndex + 1}, вариант ${oIndex + 1}: Введите текст варианта`,
            );
            isValid = false;
          }
        });
        if (!question.correctAnswer) {
          alert(
            `Тест ${testIndex + 1}, вопрос ${qIndex + 1}: Выберите правильный ответ`,
          );
          isValid = false;
        }
      });
    });

    if (!isValid) return;

    // Формирование данных для отправки
    const testData = tests.map((test) => ({
      title: test.title,
      questions: test.questions.map((question) => ({
        text: question.text,
        options: question.options,
      })),
    }));

    const answers = tests.flatMap((test) =>
      test.questions.map((question) => question.correctAnswer),
    );

    try {
      const response = await fetch(
        `${host}/teacher/test/create?discipline_id=${disciplineLink}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ test: testData, answers }),
        },
      );

      if (response.ok) router.back();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    }
  };

  return (
    <section className="w-[95%] mx-auto pt-24 pb-8 sm:pt-40 sm:pb-20">
      <ListsAnimation>
        <div className="p-4 rounded-lg sm:p-6">
          <div className="flex flex-col-reverse gap-4 justify-between items-start mb-6 sm:flex-row sm:items-center sm:mb-8">
            <button
              onClick={() => router.back()}
              className="flex gap-2 items-center text-sm sm:text-base text-text-2-color hover:text-primary-color"
            >
              <ArrowLeft size={18} /> Назад
            </button>
            <h1 className="w-full text-2xl font-bold sm:w-auto sm:text-3xl text-text-color">
              Создание теста
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            {tests.map((test, testIndex) => (
              <motion.div
                key={testIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 mb-6 rounded-xl shadow-md sm:p-6 sm:mb-8 bg-element-bg"
              >
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:gap-4 sm:mb-6">
                  <input
                    type="text"
                    value={test.title}
                    onChange={(e) => updateTestTitle(testIndex, e.target.value)}
                    placeholder="Название темы"
                    className="flex-1 text-lg bg-transparent border-b-2 sm:text-xl focus:outline-none border-primary-color text-text-color"
                  />
                  <button
                    type="button"
                    onClick={() => removeTest(testIndex)}
                    className="self-end p-2 text-red-500 rounded-lg hover:text-red-700"
                  >
                    <Trash size={22} />
                  </button>
                </div>

                {test.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="p-3 mb-4 rounded-lg sm:p-4 sm:mb-6 bg-element-bg-2"
                  >
                    <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:gap-4 sm:mb-4">
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(testIndex, qIndex, e.target.value)
                        }
                        placeholder="Текст вопроса"
                        className="flex-1 text-sm bg-transparent border-b-2 sm:text-base focus:outline-none border-primary-color text-text-color"
                      />
                      <button
                        type="button"
                        onClick={() => removeQuestion(testIndex, qIndex)}
                        className="self-end p-1 text-red-500 rounded-lg sm:p-2 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>
                    </div>

                    <div className="mb-3 space-y-2 sm:mb-4 sm:space-y-3">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className="flex gap-2 items-center sm:gap-3"
                        >
                          <span className="w-5 text-sm sm:w-6 sm:text-base text-text-color">
                            {option.label}.
                          </span>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              updateOption(
                                testIndex,
                                qIndex,
                                oIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Вариант ${option.label}`}
                            className="flex-1 text-sm bg-transparent border-b-2 border-gray-400 sm:text-base focus:outline-none text-text-color"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(testIndex, qIndex, oIndex)
                            }
                            className="p-1 text-red-500 rounded-lg hover:text-red-700"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 justify-between items-start sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={() => addOption(testIndex, qIndex)}
                        className="flex gap-2 items-center text-sm sm:text-base text-primary-color hover:text-primary-light-color"
                      >
                        <Plus size={16} /> Добавить вариант
                      </button>

                      <select
                        value={question.correctAnswer}
                        onChange={(e) =>
                          setCorrectAnswer(testIndex, qIndex, e.target.value)
                        }
                        className="py-1 px-2 w-full text-sm rounded-lg border border-gray-600 sm:px-3 sm:w-auto sm:text-base bg-element-bg text-text-color"
                      >
                        <option value="">Правильный ответ</option>
                        {question.options.map((option) => (
                          <option key={option.label} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addQuestion(testIndex)}
                  className="flex gap-2 justify-center items-center py-2 w-full text-sm rounded-lg sm:text-base text-text-color hover:bg-element-bg-2"
                >
                  <Plus size={16} /> Добавить вопрос
                </button>
              </motion.div>
            ))}

            <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:mt-8">
              <button
                type="button"
                onClick={addTest}
                className="flex gap-2 justify-center items-center py-2 px-3 text-sm text-white rounded-xl sm:px-4 sm:text-base bg-primary-color hover:bg-primary-light-color"
              >
                <Plus size={16} /> Добавить тему
              </button>

              <button
                type="submit"
                className="py-2 px-4 text-sm text-white bg-green-600 rounded-xl sm:px-6 sm:text-base hover:bg-green-700"
              >
                Сохранить тест
              </button>
            </div>
          </form>
        </div>
      </ListsAnimation>
    </section>
  );
}
