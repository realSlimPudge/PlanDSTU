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

  //Выбор блоков
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

  //Цвет блоков
  useEffect(() => {
    console.log(nodes);
  }, [nodes]);
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

  return (
    <SelectedNodesContext.Provider
      value={{
        selectedNodes,
        toggleNode,
        clearNodes,
        addNode,
        nodes,
        setNodes,
        clearNodesGrade,
        getNodeValue,
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
