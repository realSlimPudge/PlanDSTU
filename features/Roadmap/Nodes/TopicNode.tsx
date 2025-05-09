"use client";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useSelectedNodes } from "./SelectedNodesContext";

export type TopicNode = Node<{
  label: string;
  isFirst: boolean;
  isLast: boolean;
  topics: number;
}>;

export default function TopicNode({ data }: NodeProps<TopicNode>) {
  //Выбор блока
  const [selected, setSelected] = useState<boolean>(false);
  function toggleSelect() {
    setSelected((p) => !p);
  }

  //Цвет блока
  const { getNodeValue } = useSelectedNodes();
  const [grade, setGrade] = useState(0);
  useEffect(() => {
    const value = getNodeValue(data.label) || 0;
    setGrade(value);
  }, [data.label, getNodeValue]);

  const nodeClasses = [
    grade >= 0 && grade < 66 ? "bg-red-500" : "",
    grade > 66 && grade < 99 ? "bg-yellow-400" : "",
    grade === 100 ? "bg-green-500" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        onClick={toggleSelect}
        className={`py-3 px-5 pt-1 rounded-2xl border max-h-[150px] shadow-md transition duration-200 ease
        bg-gray-color-5 w-[240px] ${selected ? "border-primary-color animate-pulse" : "dark:border-divider-color "}`}
      >
        <div className="flex left-0 -top-3 gap-x-1 justify-start items-center my-1 text-xs font-light text-center text-text-2-color bg-gray-color-5">
          <div
            className={`size-2 rounded-full 
            ${nodeClasses}`}
          ></div>
          Правильных ответов:{" "}
          <span className="italic font-medium">{grade.toFixed()}%</span>
        </div>
        <h5 className="overflow-auto font-semibold text-start text-text-color hyphens-auto max-h-[116px]">
          {data.label}
        </h5>
      </div>
    </>
  );
}
