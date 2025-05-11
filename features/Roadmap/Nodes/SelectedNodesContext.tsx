"use client";

import { Grade } from "@/features/Testing/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type SelectedNodesContextType = {
  //Цвет блоков
  nodes: Grade[];
  setNodes: (nodes: Grade[]) => void;
  addNode: (node: Grade) => void;
  clearNodesGrade: () => void;
  getNodeValue: (nodeName: string) => number | undefined;

  //Выбор блоков
  selectedNodes: string[];
  toggleNode: (nodeName: string) => void;
  clearNodes: () => void;
  isNodeSelected: (nodeName: string) => boolean;

  //Все блоки
  allThemes: string[];
  addAllThemes: (themes: string[]) => void;
};

const SelectedNodesContext = createContext<SelectedNodesContextType | null>(
  null,
);

export const SelectedNodesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nodes, setNodes] = useState<Grade[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [allThemes, setAllThemes] = useState<string[]>([]);

  //Выбор блоков
  const toggleNode = useCallback((nodeName: string) => {
    setSelectedNodes((prev) =>
      prev.includes(nodeName)
        ? prev.filter((name) => name !== nodeName)
        : [...prev, nodeName],
    );
  }, []);

  const clearNodes = useCallback(() => {
    setSelectedNodes([]);
  }, []);

  const isNodeSelected = useCallback(
    (nodeName: string) => {
      return selectedNodes.includes(nodeName);
    },
    [selectedNodes],
  );

  //Цвет блоков
  const addNode = useCallback((node: Grade) => {
    setNodes((prev) => [...prev, node]);
  }, []);

  const clearNodesGrade = useCallback(() => {
    setNodes([]);
  }, []);

  const getNodeValue = useCallback(
    (nodeName: string): number | undefined => {
      const foundNode = nodes.find(
        (node) => node.name.trim() === nodeName.trim(),
      );
      return foundNode?.value;
    },
    [nodes],
  );

  //Все темы

  const addAllThemes = (themes: string[]) => {
    setAllThemes(themes);
  };

  return (
    <SelectedNodesContext.Provider
      value={{
        selectedNodes,
        toggleNode,
        clearNodes,
        addNode,
        isNodeSelected,
        nodes,
        setNodes,
        clearNodesGrade,
        getNodeValue,
        allThemes,
        addAllThemes,
      }}
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
