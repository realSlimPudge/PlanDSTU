"use client";
import { RoadmapType } from "@/features/Roadmap/Types/types";
import fetcher from "@/shared/api/getFetcher";
import host from "@/shared/host";
import ListsAnimation from "@/widgets/List/Animation/ListsAnimation";
import {
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import "@xyflow/react/dist/style.css";
import CategoryNode from "@/features/Roadmap/Nodes/CategoryNode";

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
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = useMemo(() => ({ categoryNode: CategoryNode }), []);

  useEffect(() => {
    if (!roadmap) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    roadmap.categories.forEach((cat, i) => {
      const catId = `cat-${i}`;
      const topics = cat.topics.length;
      const isFirst = i === 0;
      const isLast = i === roadmap.categories.length - 1;

      newNodes.push({
        id: catId,
        position: {
          x: i * 300,
          y: 0,
        },
        data: { label: cat.name, isFirst, isLast, topics },
        draggable: false,
        type: "categoryNode",
      });

      if (i < roadmap.categories.length - 1) {
        const nextCatId = `cat-${i + 1}`;
        newEdges.push({
          id: `edge-${catId}-${nextCatId}`,
          source: catId,
          target: nextCatId,
          type: "smoothstep",
          animated: true,
        });
      }

      // Добавление topicNode
      cat.topics.forEach((topic, j) => {
        const topicId = `topic-${i}-${j}`;
        newNodes.push({
          id: topicId,
          position: {
            x: i * 300,
            y: (j + 1) * 300,
          },
          data: { label: topic },
          draggable: false,
        });

        newEdges.push({
          id: `edge-${catId}-${topicId}`,
          source: catId,
          target: topicId,
          type: "smoothstep",
          animated: true,
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmap, setNodes, setEdges]);

  if (error) {
    return (
      <section className="sm:w-[70%] w-[85%] mx-auto h-screen flex items-center justify-center">
        <ListsAnimation>
          <div className="flex flex-col gap-y-2 justify-between items-center">
            <p className="mt-6 text-4xl text-center text-text-color">
              Ошибка загрузки данных. Попробуйте позже.
            </p>
            <button
              className="flex gap-1 items-center text-text-2-color"
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

  if (isLoading || !roadmap) {
    return (
      <div className="flex justify-center items-center pt-40 w-screen h-[600px]">
        <ListsAnimation>
          <p className="text-2xl text-text-color">Загрузка...</p>
        </ListsAnimation>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", zIndex: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
