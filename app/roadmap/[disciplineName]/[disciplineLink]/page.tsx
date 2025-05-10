"use client";
import { motion } from "framer-motion";
import { RoadmapType } from "@/features/Roadmap/Types/types";
import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import "@xyflow/react/dist/style.css";
import CategoryNode from "@/features/Roadmap/Nodes/CategoryNode";
import TopicNode from "@/features/Roadmap/Nodes/TopicNode";
import { useSelectedNodes } from "@/features/Roadmap/Nodes/SelectedNodesContext";

type RoadmapCategory = "practice" | "lectures" | "independent_works";

export default function RoadmapPage() {
  const { disciplineName, disciplineLink } = useParams<{
    disciplineName: string;
    disciplineLink: string;
  }>();
  const router = useRouter();
  const decodedName = decodeURIComponent(disciplineName);

  const {
    data: roadmap,
    error,
    isLoading,
  } = useSWR<RoadmapType>(
    `${host}/parser/roadmap/${decodedName}/${disciplineLink}`,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 0 },
  );

  const [selectedCategory, setCurrentCategory] =
    useState<RoadmapCategory>("practice");

  const categories: RoadmapCategory[] = [
    "practice",
    "lectures",
    "independent_works",
  ];
  const categoryTranslations = {
    practice: "Практика",
    lectures: "Лекции",
    independent_works: "Самостоятельные работы",
  };
  const handleNext = () => {
    const currentIndex = categories.indexOf(selectedCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    setCurrentCategory(categories[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = categories.indexOf(selectedCategory);
    const prevIndex =
      (currentIndex - 1 + categories.length) % categories.length;
    setCurrentCategory(categories[prevIndex]);
  };
  //Добавление списка всех тем
  const { addAllThemes } = useSelectedNodes();
  useEffect(() => {
    if (roadmap) {
      const allThemes = roadmap[selectedCategory].categories.flatMap(
        (category) => category.topics,
      );
      addAllThemes(allThemes);
    }
  }, [roadmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo(
    () => ({ categoryNode: CategoryNode, topicNode: TopicNode }),
    [],
  );

  useEffect(() => {
    if (!roadmap) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    roadmap[selectedCategory].categories.forEach((cat, i) => {
      const catId = `cat-${i}`;
      const topics = cat.topics.length;
      const isFirst = i === 0;
      const isLast = i === roadmap.practice.categories.length - 1;

      newNodes.push({
        id: catId,
        position: {
          x: i * 320,
          y: 0,
        },
        data: { label: cat.name, isFirst, isLast, topics },
        draggable: false,
        type: "categoryNode",
      });

      if (i < roadmap[selectedCategory].categories.length - 1) {
        const nextCatId = `cat-${i + 1}`;
        newEdges.push({
          id: `edge-${catId}-${nextCatId}`,
          source: catId,
          target: nextCatId,
          type: "default",
          animated: false,
        });
      }

      // Добавление topicNode
      cat.topics.forEach((topic, j) => {
        const topicId = `topic-${i}-${j}`;
        newNodes.push({
          id: topicId,
          position: {
            x: i * 320,
            y: (j + 1) * 300,
          },
          data: { label: topic },
          draggable: false,
          type: "topicNode",
        });

        newEdges.push({
          id: `edge-${catId}-${topicId}`,
          source: catId,
          target: topicId,
          type: "smoothless",
          sourceHandle: "topic",
          animated: true,
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmap, setNodes, setEdges, selectedCategory]);

  //Обработчик клика на node
  const { toggleNode } = useSelectedNodes();
  const handleNodeClick = (e: React.MouseEvent, node: Node) => {
    if (node.type === "topicNode") {
      const nodeName: string = node.data.label as string;
      toggleNode(nodeName);
    }
  };

  if (error) {
    return (
      <section className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              Ошибка загрузки данных. Попробуйте позже.
            </p>
            <button
              className="flex gap-1 items-center cursor-pointer text-text-2-color"
              onClick={() => router.back()}
            >
              <ArrowLeft strokeWidth={2} size={20} />
              Назад
            </button>
          </div>
        </ListsAnimation>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen z-60">
        <ListsAnimation>
          <div className="w-10 h-10 rounded-full animate-spin border-3 border-primary-color border-b-transparent"></div>
        </ListsAnimation>
      </div>
    );
  }

  if (
    !isLoading &&
    roadmap &&
    roadmap[selectedCategory].categories.length === 0
  ) {
    return (
      <div className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              К сожалению карта по данному предменту отсутствует
            </p>
            <button
              className="flex gap-1 items-center cursor-pointer text-text-2-color"
              onClick={() => router.back()}
            >
              <ArrowLeft strokeWidth={2} size={20} />
              Назад
            </button>
          </div>
        </ListsAnimation>
      </div>
    );
  }

  return (
    <motion.div
      style={{ width: "100vw", height: "100vh", zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
      >
        {" "}
        <div className="flex absolute bottom-3 left-3 gap-x-2 py-3 px-2 rounded-2xl shadow-md z-60 bg-gray-color-3 text-text-color">
          <button
            onClick={handlePrev}
            className="rounded-md transition duration-200 cursor-pointer text-text-2-color ease hover:bg-gray-color-1"
          >
            <ChevronLeft />
          </button>
          <h1>{categoryTranslations[selectedCategory]}</h1>

          <button
            onClick={handleNext}
            className="rounded-md transition duration-200 cursor-pointer text-text-2-color ease hover:bg-gray-color-1"
          >
            <ChevronRight />
          </button>
        </div>
        <Controls position="center-left" orientation="vertical" />
        <Background />
      </ReactFlow>
    </motion.div>
  );
}
