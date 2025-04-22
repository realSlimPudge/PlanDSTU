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
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!roadmap) return;

    const nodeWidth = 240;
    const nodeHeight = 120;
    const horizontalSpacing = 300;

    const newNodes: Node[] = roadmap.categories.map((item, idx) => ({
      id: `node-${idx}`,
      position: { x: idx * horizontalSpacing, y: 0 },
      draggable: false,
      data: {
        label: (
          <div style={{ padding: 10 }}>
            <strong>{item.name}</strong>
            <ul
              style={{
                marginTop: 8,
                fontSize: 12,
                listStyle: "disc",
                paddingLeft: 16,
              }}
            >
              {item.topics.map((t, i) => (
                <li key={i}>{t.trim()}</li>
              ))}
            </ul>
          </div>
        ),
      },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        border: "1px solid #bbb",
        borderRadius: 8,
        background: "#fff",
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }));

    const newEdges: Edge[] = roadmap.categories.slice(1).map((_, idx) => ({
      id: `e-${idx}-${idx + 1}`,
      source: `node-${idx}`,
      target: `node-${idx + 1}`,
      type: "smoothstep",
      animated: true,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmap, setNodes, setEdges]);

  const nodeTypes = {
    categoryNode: CategoryNode,
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
