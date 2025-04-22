import { Handle, Position } from "@xyflow/react";

type NodeProps = {
  label: string;
  isFirst: string;
  isLast: string;
  topics: number;
};
export default function CategoryNode(data: NodeProps) {
  const { label, isFirst, isLast, topics } = data;

  return (
    <div>
      {!isFirst && <Handle type="target" position={Position.Left} />}
      <h5>{label}</h5>
      {!isLast && <Handle type="source" position={Position.Right} />}
      {topics > 0 && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}
