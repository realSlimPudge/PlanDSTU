// TestWidget.tsx
"use client";

import { useGlobalTests } from "@/features/Testing/GlobalTestContext";
import { BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TestWidget() {
  const { generatedTests } = useGlobalTests();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (generatedTests.length === 0) return null;
  return (
    <Link
      href={`/roadmap/${generatedTests[0].disciplineName}/${generatedTests[0].disciplineLink}`}
      className="flex relative justify-center items-center rounded-sm border-2 transition duration-300 ease size-[36px] bg-element-bg border-gray-color-3 hover:bg-gray-color-4"
    >
      <BookOpenIcon className="text-text-color size-5" />
      <span className="absolute z-30 rounded-full animate-ping -top-[2px] -right-[2px] w-[10px] h-[10px] bg-primary-color sm:w-[14px] sm:h-[14px]"></span>
      <div className="flex absolute -top-1 -right-1 z-40 justify-center items-center rounded-full sm:text-sm text-[10px] w-[14px] h-[14px] text-text-contrast-color bg-primary-color sm:w-[18px] sm:h-[18px]">
        {generatedTests.length}
      </div>
    </Link>
  );
}
