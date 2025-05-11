"use client";

import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

export type TestStatus = {
  task_id: string;
  status: "active" | "retry" | "completed" | "pending";
  disciplineLink: string;
  disciplineName: string;
  createdAt: string;
};

type TestContextType = {
  pendingTests: TestStatus[];
  generatedTests: TestStatus[];
  addTest: (
    task_id: string,
    disciplineLink: string,
    disciplineName: string,
  ) => void;
  moveToGenerated: (test: TestStatus) => void;
  clearGeneratedTests: () => void;
};

const TestContext = createContext<TestContextType>({
  pendingTests: [],
  generatedTests: [],
  addTest: () => {},
  moveToGenerated: () => {},
  clearGeneratedTests: () => {},
});

const LOCAL_STORAGE_KEYS = {
  PENDING: "pending_tests",
  GENERATED: "generated_tests",
};

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [pendingTests, setPendingTests] = useState<TestStatus[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PENDING);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [generatedTests, setGeneratedTests] = useState<TestStatus[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GENERATED);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Сохранение в localstorage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.PENDING,
      JSON.stringify(pendingTests),
    );
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.GENERATED,
      JSON.stringify(generatedTests),
    );
  }, [pendingTests, generatedTests]);

  const addTest = (
    task_id: string,
    disciplineLink: string,
    disciplineName: string,
  ) => {
    const newTest: TestStatus = {
      task_id,
      disciplineLink,
      disciplineName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setPendingTests((prev) => [...prev, newTest]);
  };

  const moveToGenerated = (test: TestStatus) => {
    setPendingTests((prev) => prev.filter((t) => t.task_id !== test.task_id));
    setGeneratedTests((prev) => [...prev, { ...test, status: "completed" }]);
  };

  const clearGeneratedTests = () => {
    setGeneratedTests([]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.GENERATED);
  };

  const updateTestStatus = (
    task_id: string,
    newStatus: TestStatus["status"],
  ) => {
    setPendingTests((prev) =>
      prev.map((t) =>
        t.task_id === task_id ? { ...t, status: newStatus } : t,
      ),
    );
  };

  const { disciplineLink } = useParams<{ disciplineLink: string }>();

  const handleComplete = (test: TestStatus) => {
    mutate(`${host}/tests/history?link=${encodeURIComponent(disciplineLink)}`);
    moveToGenerated(test);

    toast.success("Тестирование", {
      description: "Тест успешно сгенерирован",

      action: {
        label: "Открыть",
        onClick: () =>
          router.push(`/roadmap/${test.disciplineName}/${test.disciplineLink}`),
      },
    });
  };

  return (
    <TestContext.Provider
      value={{
        pendingTests,
        generatedTests,
        addTest,
        moveToGenerated,
        clearGeneratedTests,
      }}
    >
      {pendingTests.map((test) => (
        <TestStatusChecker
          key={test.task_id}
          test={test}
          onUpdate={(newStatus) => {
            updateTestStatus(test.task_id, newStatus);
            if (newStatus === "completed") {
              handleComplete(test);
            }
          }}
          onRemove={() => moveToGenerated(test)}
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
  useSWR<{ status: TestStatus["status"] }>(
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
