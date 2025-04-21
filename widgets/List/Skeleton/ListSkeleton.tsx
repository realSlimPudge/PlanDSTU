import ButtonLinkSkeleton from "./ButtonSkelet";

export default function ListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <ButtonLinkSkeleton key={i} />
        ))}
    </div>
  );
}
