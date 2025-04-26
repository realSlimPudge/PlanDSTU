"use client";
import Chat from "@/features/Chat/Chat";
import { Bot } from "lucide-react";
import { useState } from "react";

export default function RoadmapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  function handleChatOpen() {
    setChatOpen((p) => !p);
  }

  return (
    <div className="overflow-hidden relative">
      <div
        className={` transition duration-300 ease absolute z-20  transform h-[calc(100vh_-_70px)] top-[70px] md:w-2/5 w-full 
          right-0  ${chatOpen ? "translate-x-[100%] " : "translate-x-[0%] "}`}
      >
        <Chat closeAction={handleChatOpen} />
      </div>
      <button
        onClick={handleChatOpen}
        className="absolute right-3 bottom-3 z-10 p-4 rounded-3xl cursor-pointer sm:p-6 bg-primary-color"
      >
        <Bot className="text-text-contrast-color" />
      </button>
      {children}
    </div>
  );
}
