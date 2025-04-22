import DirectionLinkButton from "./LinkButton/DirectionLinkButton";
import { FacultyDirection } from "./Types/types";

type ListProps = {
  data: FacultyDirection[];
};

export default function ListDirections({ data }: ListProps) {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((el, i) => (
        <DirectionLinkButton props={el} key={i} />
      ))}
    </div>
  );
}
