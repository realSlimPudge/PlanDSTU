"use client";
import TextareaAutosize from "react-textarea-autosize";
import host from "@/shared/host";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { ArrowUp, Globe, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatMessages = {
  sender: "user" | "bot";
  content: string;
};

type ChatProps = {
  closeAction: () => void;
};

export default function Chat({ closeAction: close }: ChatProps) {
  const [search, setSearch] = useState<boolean>(false);
  const [canSend, setCanSend] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessages[]>([]);

  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    setCanSend(message.trim().length > 0);
  }, [message]);

  // функция открытия SSE-потока
  const startStream = () => {
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    setMessages((prev) => [...prev, { sender: "bot", content: "" }]);

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
        if (msgs[lastIndex].sender === "bot") {
          msgs[lastIndex] = {
            sender: "bot",
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

  return (
    <div className="flex relative flex-col w-full h-full border-l bg-app-bg border-divider-color">
      <button
        className="absolute top-5 right-5 z-30 cursor-pointer"
        onClick={close}
      >
        <X className="text-text-color" />
      </button>
      <div className="flex overflow-auto flex-col p-4 pt-20 pb-40 space-y-4 h-11/12">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-lg max-w-[80%] w-fit ${msg.sender === "user"
                ? "bg-primary-color text-text-contrast-color self-end"
                : "bg-element-bg text-text-color self-start"
              }`}
          >
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="flex absolute bottom-0 flex-col justify-center items-center p-4 w-full">
        <div className="flex flex-col gap-y-1 justify-between p-3 w-full rounded-3xl border h-fit bg-element-bg text-text-color border-divider-color">
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Введите запрос..."
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
