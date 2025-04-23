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
      <div className="bg-gray-color-5 w-[200px] rounded-2xl px-2 py-3">
        <h5 className="text-center text-text-2-color ">{data.label}</h5>
      </div>
    </>
  );
}
