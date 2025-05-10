"use client";

import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

export type TestStatus = {
  task_id: string;
  status: "active" | "retry" | "completed" | "pending";
  disciplineLink: string;
};

type TestContextType = {
  activeTests: TestStatus[];
  addTest: (task_id: string, disciplineLink: string) => void;
};

const TestContext = createContext<TestContextType>({
  activeTests: [],
  addTest: () => { },
});

const LOCAL_STORAGE_KEY = "active_tests";

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const { mutate } = useSWRConfig();
  const [activeTests, setActiveTests] = useState<TestStatus[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  //Сохраняем в localstorage при изменении
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeTests));
  }, [activeTests]);

  const addTest = (task_id: string, disciplineLink: string) => {
    setActiveTests((prev) => [
      ...prev,
      { task_id, status: "pending", disciplineLink },
    ]);
  };

  const updateTestStatus = (
    task_id: string,
    newStatus: TestStatus["status"],
  ) => {
    setActiveTests((prev) =>
      prev.map((t) =>
        t.task_id === task_id ? { ...t, status: newStatus } : t,
      ),
    );
  };

  const { disciplineLink } = useParams<{ disciplineLink: string }>();
  const removeTest = (task_id: string) => {
    mutate(`${host}/tests/history?link=${encodeURIComponent(disciplineLink)}`);
    setActiveTests((prev) => prev.filter((t) => t.task_id !== task_id));
  };

  return (
    <TestContext.Provider value={{ activeTests, addTest }}>
      {activeTests.map((test) => (
        <TestStatusChecker
          key={test.task_id}
          test={test}
          onUpdate={(newStatus) => {
            updateTestStatus(test.task_id, newStatus);
            if (newStatus === "completed") {
              toast.success("Тестирование", {
                description: "Тест успешно сгенерирован",
              });
              removeTest(test.task_id);
            }
          }}
          onRemove={() => removeTest(test.task_id)}
        />
      ))}
      {children}
    </TestContext.Provider>
  );
};

const TestStatusChecker = ({
  test,
  onUpdate,
  onRemove,
}: {
  test: TestStatus;
  onUpdate: (status: TestStatus["status"]) => void;
  onRemove: () => void;
}) => {
  const { } = useSWR<{ status: TestStatus["status"] }>(
    `${host}/tests/status?task_id=${test.task_id}`,
    fetcher,
    {
      refreshInterval: 10000,
      onSuccess: (data) => {
        if (data.status !== test.status) onUpdate(data.status);
        if (data.status === "completed") onRemove();
      },
      onError: () => onRemove(),
    },
  );
  return null;
};

export const useGlobalTests = () => useContext(TestContext);
