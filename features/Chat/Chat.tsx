"use client";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import host from "@/shared/host";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
  ArrowDown,
  ArrowUp,
  BookOpenIcon,
  FileClock,
  Globe,
  RefreshCcw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "@/shared/api/getFetcher";
import clearHistory from "./api/clearHistory";
import { ChatMessages, ChatProps, HistoryRes } from "./types";
import { useSelectedNodes } from "../Roadmap/Nodes/SelectedNodesContext";
import { useParams } from "next/navigation";

export default function Chat({
  closeTestAction: close,
  closeHistoryAction: historyClose,
  testModalAction,
}: ChatProps) {
  const {
    data: history,
    error,
    isLoading,
    mutate,
  } = useSWR<HistoryRes>(`${host}/llm/history`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
  const { mutate: mutateHistory } = useSWRConfig();

  const { disciplineLink } = useParams<{ disciplineLink: string }>();

  const { selectedNodes, allThemes } = useSelectedNodes();

  const [search, setSearch] = useState<boolean>(false);
  const [canSend, setCanSend] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessages[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<EventSource | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // const [visible, setVisible] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const clientHeight = el.clientHeight;
      const scrollHeight = el.scrollHeight;

      // setVisible(scrollTop < 10);
      setShowScrollDown(scrollHeight - scrollTop > clientHeight + 10);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    // чистим слушатель
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  useEffect(() => {
    if (history?.history) {
      setMessages(history.history);
    }
  }, [history]);

  useEffect(() => {
    setCanSend(message.trim().length > 0);
  }, [message]);

  // функция открытия SSE-потока
  const startStream = () => {
    setMessages((prev) => [...prev, { type: "human", content: message }]);
    setMessages((prev) => [...prev, { type: "ai", content: "" }]);

    sourceRef.current?.close();

    setMessage("");

    // создаём новый
    const url = `${host}/llm/chat?message=${encodeURIComponent(message)}`;
    const source = new EventSource(url, { withCredentials: true });
    sourceRef.current = source;

    source.onmessage = (event) => {
      const chunk = event.data.replace(/\/n/g, "\n");

      setMessages((prev) => {
        const msgs = [...prev];
        const lastIndex = msgs.length - 1;
        if (msgs[lastIndex].type === "ai") {
          msgs[lastIndex] = {
            type: "ai",
            content: msgs[lastIndex].content + chunk,
          };
        }
        return msgs;
      });
    };

    source.onerror = (err) => {
      console.error("SSE error", err);
      source.close();
    };
  };

  // очистка при размонтировании
  useEffect(() => {
    return () => {
      sourceRef.current?.close();
    };
  }, []);

  //Для поиска
  function handleSearch() {
    setSearch((p) => !p);
  }
  //Для отправки
  useEffect(() => {
    if (message.trim() === "") {
      setCanSend(false);
    } else {
      setCanSend(true);
    }
  }, [message]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const confirmClear = async () => {
    try {
      await clearHistory();
      setMessages([]);
      mutate();
      setShowModal(false);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const getFirstTest = async () => {
    try {
      const res = await fetch(
        `${host}/tests/first-test?discipline_id=${disciplineLink}`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({ themes: allThemes }),
        },
      );
      if (!res.ok) throw new Error("Попробуйте позже");
    } catch (e) {
      console.error(e);
    } finally {
      mutateHistory(
        `${host}/tests/history?link=${encodeURIComponent(disciplineLink)}`,
      );
      close();
    }
  };

  return (
    <div className="flex relative flex-col w-full h-full border-l bg-app-bg border-divider-color">
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex fixed inset-0 z-40 justify-center items-center bg-black/50"
        >
          <div className="p-6 w-80 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Подтвердите действие
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Вы уверены, что хотите удалить весь чат? Это действие необратимо.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 text-gray-700 rounded-lg border border-gray-300 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Отмена
              </button>
              <button
                onClick={confirmClear}
                className="py-2 px-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <div
        className={`bg-app-bg rounded-b-xl absolute transform translate-x-[-50%] border border-gray-color-3 border-t-0 transition-all ease duration-300 top-0 left-1/2 w-fit gap-x-3 items-center 
        justify-between sm:px-3 px-3 flex sm:py-1 py-2 z-30 cursor-pointer `}
      >
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="p-1 rounded-sm transition-all duration-300 cursor-pointer group ease hover:bg-gray-color-1"
        >
          <Trash2 className="text-text-color w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
        </button>
        <button
          className="p-1 rounded-sm transition-all duration-300 cursor-pointer group ease hover:bg-gray-color-1"
          onClick={close}
        >
          <X className="text-text-color w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
        </button>
        <button
          onClick={testModalAction}
          className="relative p-1 rounded-sm transition-all duration-300 cursor-pointer group ease hover:bg-gray-color-1"
        >
          <BookOpenIcon className="text-text-color w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
          {selectedNodes.length > 0 && (
            <>
              <span className="absolute z-30 rounded-full animate-ping top-[2px] right-[2px] w-[10px] h-[10px] bg-primary-color sm:w-[14px] sm:h-[14px]"></span>
              <div className="flex absolute top-0 right-0 z-40 justify-center items-center rounded-full sm:text-sm text-[10px] w-[14px] h-[14px] text-text-contrast-color bg-primary-color sm:w-[18px] sm:h-[18px]">
                {selectedNodes.length}
              </div>
            </>
          )}
        </button>
        <button
          onClick={historyClose}
          className="relative p-1 rounded-sm transition-all duration-300 cursor-pointer group ease hover:bg-gray-color-1"
        >
          <FileClock className="text-text-color w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
        </button>
        <button
          onClick={getFirstTest}
          className="relative p-1 rounded-sm transition-all duration-300 cursor-pointer group ease hover:bg-gray-color-1"
        >
          <RefreshCcw className="text-text-color w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]" />
        </button>
      </div>
      <div
        className="flex overflow-auto flex-col p-4 pt-20 pb-40 space-y-4 h-11/12"
        ref={containerRef}
      >
        {" "}
        {isLoading && (
          <div className="self-center text-sm text-gray-500">
            Загрузка истории...
          </div>
        )}
        {error && (
          <div className="self-center text-sm text-red-500">
            Ошибка загрузки истории.{" "}
            <button onClick={() => mutate()} className="underline">
              Повторить
            </button>
          </div>
        )}
        {!isLoading && !error && messages.length === 0 && (
          <div className="self-center text-sm text-gray-500">
            Пока история пуста
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-lg w-fit ${msg.type === "human"
                ? "bg-primary-color text-text-contrast-color self-end max-w-[80%] "
                : "bg-transparent text-text-color self-start max-w-full"
              }`}
          >
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex absolute bottom-0 flex-col justify-center items-center p-4 w-full">
        <button
          className={`absolute transform border-gray-color-3 border translate-x-[-50%] left-[50%] top-[-30px] rounded-full p-1 bg-app-bg cursor-pointer hover:bg-gray-color-7 
           transition-all duration-300 ease ${showScrollDown ? "opacity-100" : "opacity-0"}`}
          onClick={scrollToBottom}
        >
          <ArrowDown className="text-text-color" size={20} />
        </button>
        <div className="flex flex-col gap-y-1 justify-between p-3 w-full rounded-3xl border transition duration-200 h-fit bg-element-bg ease text-text-color border-divider-color hover:border-primary-light-color">
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Введите текст..."
            className="overflow-auto p-2 w-full rounded-lg outline-none resize-none bg-element-bg text-text-color border-divider-color"
          />
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleSearch}
              className={`flex sm:text-md text-sm transition ease duration-300 gap-x-2 justify-between items-center py-2 px-3 rounded-3xl border cursor-pointer ${search ? "bg-primary-color  border-primary-color text-text-contrast-color" : "border-divider-color"}`}
            >
              <Globe size={20} />
              Поиск
            </button>

            <button
              disabled={!canSend}
              onClick={startStream}
              className={`py-2 px-2 rounded-full border cursor-pointer disabled:cursor-default border-divider-color ${canSend ? "bg-primary-color border-primary-color" : ""}`}
            >
              <ArrowUp
                size={20}
                className={`${!canSend ? "text-gray-color-3" : "text-text-contrast-color"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
