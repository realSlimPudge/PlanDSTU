"use client";
import Chat from "@/features/Chat/Chat";
import { useSelectedNodes } from "@/features/Roadmap/Nodes/SelectedNodesContext";
import FirstTesting from "@/features/Testing/Testing";
import { FirstTest, Theme } from "@/features/Testing/types";
import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import { Bot } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function RoadmapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //Закрытие чата при заходе на страницу
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { clearNodes } = useSelectedNodes();

  //Закрытие чата и очистка при смене пути
  useEffect(() => {
    setChatOpen(false);
    clearNodes();
  }, [pathname, clearNodes]);

  //История первичного тестирования
  const { disciplineLink } = useParams<{ disciplineLink: string }>();
  const [needFirstTest, setNeedFirstTest] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);

  const { data: historyTest, isLoading: historyLoading } = useSWR<FirstTest>(
    `${host}/tests/history?link=${encodeURIComponent(disciplineLink)}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (!historyTest) return;
    const needsTest =
      !!historyTest.error ||
      historyTest.roadmap_history?.Tests?.[0]?.IsFirst === true;

    setNeedFirstTest(needsTest);
  }, [historyTest]);

  //Открытие чата или тестирования
  function handleChatOpen() {
    setChatOpen((p) => !p);
  }
  function handleTestModalOpen() {
    setShowTestModal((p) => !p);
  }

  //Установка теста, если он есть в истории
  const [test, setTest] = useState<Theme[] | null>(null);

  useEffect(() => {
    if (
      historyTest?.roadmap_history?.Tests?.[0]?.DetailsJSONB?.test &&
      !historyLoading
    ) {
      setTest(historyTest?.roadmap_history.Tests[0].DetailsJSONB.test);
    } else {
      setTest(null);
    }
  }, [historyTest, historyLoading]);

  return (
    <div className="overflow-hidden relative">
      <FirstTesting
        needFirstTest={needFirstTest}
        onCloseAction={handleTestModalOpen}
        isOpen={showTestModal}
        test={test}
      />
      <div
        className={` transition duration-300 ease absolute z-20  transform h-[calc(100vh_-_70px)] top-[70px] md:w-2/5 w-full 
          right-0  ${!chatOpen ? "translate-x-[100%] " : "translate-x-[0%] "}`}
      >
        <Chat closeAction={handleChatOpen} />
      </div>
      <button
        onClick={needFirstTest ? handleTestModalOpen : handleChatOpen}
        className={`absolute right-3 bottom-3 z-10 p-4 rounded-3xl sm:p-6 cursor-pointer ${needFirstTest ? "bg-gray-color-5 shadow-md" : "bg-primary-color "}`}
      >
        <Bot className="text-text-contrast-color" />
      </button>
      {children}
    </div>
  );
}
