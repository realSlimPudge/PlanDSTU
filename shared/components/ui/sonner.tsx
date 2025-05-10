"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-[#11519c] text-white border border-[#0d4585]",
          title: "text-white",
          description: "text-white",
          actionButton: "bg-white text-[#11519c]",
          cancelButton: "bg-[#0d4585] text-white",
          closeButton: "text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
