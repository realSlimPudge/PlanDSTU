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
      <div className="bg-primary-light-color w-[200px] rounded-2xl px-2 py-3">
        <h5 className="text-center text-text-contrast-color font-bold">
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
