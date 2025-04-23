import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export type TopicNode = Node<{
  label: string;
  isFirst: boolean;
  isLast: boolean;
  topics: number;
}>;

export default function TopicNode({ data }: NodeProps<TopicNode>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="py-3 px-2 rounded-2xl border-2 shadow-md bg-gray-color-5 w-[200px] border-gray-color-3">
        <h5 className="text-center text-text-color">{data.label}</h5>
      </div>
    </>
  );
}
