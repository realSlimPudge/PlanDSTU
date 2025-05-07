"use client";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type CategoryNode = Node<{
  label: string;
  isFirst: boolean;
  isLast: boolean;
  topics: number;
}>;

export default function CategoryNode({ data }: NodeProps<CategoryNode>) {
  return (
    <>
      {!data.isFirst && <Handle type="target" position={Position.Left} />}
      <div
        className={`py-3 px-2 rounded-2xl border-2 shadow-md w-[200px] border-primary-color bg-primary-color  `}
      >
        <h5 className="font-bold text-center text-text-contrast-color">
          {data.label}
        </h5>
      </div>
      {!data.isLast && <Handle type="source" position={Position.Right} />}
      {data.topics > 0 && (
        <Handle type="source" position={Position.Bottom} id="topic" />
      )}
    </>
  );
}
