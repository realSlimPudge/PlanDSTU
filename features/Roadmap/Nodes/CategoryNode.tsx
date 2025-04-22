import { Handle, NodeProps, Position } from "@xyflow/react";

type CategoryData = {
  label: string;
  isFirst: boolean;
  isLast: boolean;
  topics: number;
};
export default function CategoryNode({ data }: NodeProps<CategoryData>) {
  const { label, isFirst, isLast, topics } = data;

  return (
    <>
      {!isFirst && <Handle type="target" position={Position.Left} />}
      <div>
        <h5>{label}</h5>
      </div>
      {!isLast && <Handle type="source" position={Position.Right} />}
      {topics > 0 && <Handle type="source" position={Position.Bottom} />}
    </>
  );
}
