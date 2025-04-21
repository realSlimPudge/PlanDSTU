import DirectionLinkButton from "./LinkButton/DirectionLinkButton";
import ListSkeleton from "./Skeleton/ListSkeleton";
import { FacultyDirection } from "./Types/types";

type ListProps = {
  data: FacultyDirection[];
  isLoading: boolean;
};

export default function ListDirections({ data, isLoading }: ListProps) {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((el, i) => (
        <DirectionLinkButton props={el} key={i} />
      ))}
    </div>
  );
}
