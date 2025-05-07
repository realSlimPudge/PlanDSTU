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
    "py-3 px-2 rounded-2xl border-2 max-h-[150px] shadow-md bg-gray-color-5 w-[200px]",
    selected && "border-primary-color animate-bounce",
    grade > 33 && grade < 66 ? "bg-red-900" : "border-gray-color-3",
    grade > 66 && grade < 99 ? "bg-yellow-600" : "border-gray-color-3",
    grade === 100 ? "bg-green-700" : "border-gray-color-3",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div onClick={toggleSelect} className={nodeClasses}>
        <h5 className="text-center text-text-color">{data.label}</h5>
        <div className="mt-1 text-xs text-center">
          Правильных ответов: {grade.toFixed()}%
        </div>
      </div>
    </>
  );
}
