"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash, ArrowLeft, Save, Edit, X } from "lucide-react";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import useSWR, { mutate } from "swr";
import host from "@/shared/host";
import fetcher from "@/shared/api/getFetcher";

interface Test {
  ID: string;
  DisciplineID: number;
  DetailsJSONB: {
    title: string;
    questions: {
      text: string;
      options: {
        label: string;
        text: string;
      }[];
    }[];
  }[];
  Answers: string[];
  CreatedAt: string;
}

interface TestData {
  test: Test[];
}

export default function TestDetailPage() {
  const router = useRouter();
  const { disciplineLink } = useParams<{ disciplineLink: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);

  const { data, error, isLoading } = useSWR<TestData>(
    `${host}/teacher/test?discipline_id=${disciplineLink}`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => console.error("Data loading error:", err),
    },
  );

  const handleFieldChange = (
    path: string,
    value: string,
    testIndex: number,
  ) => {
    if (!data) return;

    const newData = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let current = newData.test[testIndex];

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    mutate(
      `${host}/teacher/test?discipline_id=${disciplineLink}`,
      newData,
      false,
    );
  };

  const handleSave = async (testId: string) => {
    if (!data) return;

    try {
      const response = await fetch(`${host}/teacher/test`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.test.find((t) => t.ID === testId)),
      });

      if (response.ok) {
        await mutate(`${host}/teacher/test?discipline_id=${disciplineLink}`);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (testId: string) => {
    if (confirm("Вы уверены что хотите удалить тест?")) {
      try {
        await fetch(`${host}/teacher/test?test_id=${testId}`, {
          method: "DELETE",
          credentials: "include",
        });
        mutate(`${host}/teacher/test?discipline_id=${disciplineLink}`);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-screen h-screen z-60">
        <ListsAnimation>
          <div className="w-10 h-10 rounded-full animate-spin border-3 border-primary-color border-b-transparent"></div>
        </ListsAnimation>
      </div>
    );
  if (error) return <div className="p-4 text-red-500">Ошибка загрузки</div>;
  if (!data || !data.test)
    return (
      <div className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              Тестов не найдено
            </p>
            <button
              className="flex gap-1 items-center cursor-pointer text-text-2-color"
              onClick={() => router.back()}
            >
              <ArrowLeft strokeWidth={2} size={20} />
              Назад
            </button>
          </div>
        </ListsAnimation>
      </div>
    );

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

            <div className="flex gap-4 items-center">
              <select
                value={selectedTestIndex}
                onChange={(e) => setSelectedTestIndex(Number(e.target.value))}
                className="py-1 px-3 rounded-lg bg-element-bg text-text-color"
              >
                {data.test.map((test, index) => (
                  <option key={test.ID} value={index}>
                    Тест {index + 1}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-lg hover:bg-element-bg-2"
                >
                  {isEditing ? <X size={20} /> : <Edit size={20} />}
                </button>
                <button
                  onClick={() => handleDelete(data.test[selectedTestIndex].ID)}
                  className="p-2 text-red-500 rounded-lg hover:bg-red-100"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          </div>

          {data.test.map((test, testIndex) => (
            <div
              key={test.ID}
              className={testIndex === selectedTestIndex ? "block" : "hidden"}
            >
              <div className="flex gap-4 items-center mb-6">
                {isEditing ? (
                  <input
                    value={test.DetailsJSONB[0].title}
                    onChange={(e) =>
                      handleFieldChange(
                        "DetailsJSONB.0.title",
                        e.target.value,
                        testIndex,
                      )
                    }
                    className="text-2xl font-bold border-b-2 sm:text-3xl bg-element-bg border-primary-color"
                  />
                ) : (
                  <h1 className="text-2xl font-bold sm:text-3xl text-text-color">
                    {test.DetailsJSONB[0].title}
                  </h1>
                )}
              </div>

              {/* Начало изменений - перебираем все темы */}
              {test.DetailsJSONB.map((theme, themeIndex) => (
                <div
                  key={themeIndex}
                  className="p-4 mb-8 rounded-lg bg-element-bg-2"
                >
                  <div className="mb-4">
                    {isEditing ? (
                      <input
                        value={theme.title}
                        onChange={(e) =>
                          handleFieldChange(
                            `DetailsJSONB.${themeIndex}.title`,
                            e.target.value,
                            testIndex,
                          )
                        }
                        className="w-full text-xl font-bold border-b-2 bg-element-bg border-primary-color"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-text-color">
                        {theme.title}
                      </h2>
                    )}
                  </div>

                  <div className="space-y-6">
                    {theme.questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="p-4 rounded-lg bg-element-bg"
                      >
                        <div className="mb-4">
                          {isEditing ? (
                            <input
                              value={question.text}
                              onChange={(e) =>
                                handleFieldChange(
                                  `DetailsJSONB.${themeIndex}.questions.${qIndex}.text`,
                                  e.target.value,
                                  testIndex,
                                )
                              }
                              className="w-full border-b-2 bg-element-bg border-primary-color"
                            />
                          ) : (
                            <h3 className="text-lg font-semibold">
                              {question.text}
                            </h3>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className="p-3 rounded-lg bg-element-bg-2"
                            >
                              <div className="flex gap-2 items-center mb-2">
                                <span className="font-bold">
                                  {option.label}.
                                </span>
                                {isEditing ? (
                                  <input
                                    value={option.text}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        `DetailsJSONB.${themeIndex}.questions.${qIndex}.options.${oIndex}.text`,
                                        e.target.value,
                                        testIndex,
                                      )
                                    }
                                    className="flex-1 border-b-2 border-gray-400 bg-element-bg"
                                  />
                                ) : (
                                  <span>{option.text}</span>
                                )}
                              </div>
                              {isEditing && (
                                <label className="flex gap-2 items-center text-sm">
                                  <input
                                    type="radio"
                                    name={`correct-answer-${testIndex}-${themeIndex}-${qIndex}`}
                                    checked={
                                      test.Answers[qIndex] === option.label
                                    }
                                    onChange={() =>
                                      handleFieldChange(
                                        `Answers.${qIndex}`,
                                        option.label,
                                        testIndex,
                                      )
                                    }
                                  />
                                  Правильный ответ
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {isEditing && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => handleSave(test.ID)}
                    className="flex gap-2 items-center py-2 px-4 text-white bg-green-600 rounded-xl hover:bg-green-700"
                  >
                    <Save size={18} /> Сохранить изменения
                  </button>
                </div>
              )}

              <div className="mt-6 text-sm text-gray-500">
                <p>ID: {test.ID}</p>
                <p>
                  Дата создания:{" "}
                  {new Date(test.CreatedAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ListsAnimation>
    </section>
  );
}
