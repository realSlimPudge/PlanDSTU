"use client";

import { createContext, useCallback, useContext, useState } from "react";

type SelectedNodesContextType = {
  selectedNodes: string[];
  toggleNode: (nodeName: string) => void;
  clearNodes: () => void;
};

const SelectedNodesContext = createContext<SelectedNodesContextType | null>(
  null,
);

export const SelectedNodesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const toggleNode = useCallback((nodeName: string) => {
    setSelectedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return Array.from(newSet);
    });
  }, []);

  const clearNodes = useCallback(() => {
    setSelectedNodes([]);
  }, []);

  return (
    <SelectedNodesContext.Provider
      value={{ selectedNodes, toggleNode, clearNodes }}
    >
      {children}
    </SelectedNodesContext.Provider>
  );
};

export const useSelectedNodes = () => {
  const context = useContext(SelectedNodesContext);
  if (!context) {
    throw new Error("Нельзя использовать без провайдера");
  }
  return context;
};
