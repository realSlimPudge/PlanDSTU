import FacultyLinkButton from "./LinkButton/FacultyLinkButton";
import { Faculty } from "./Types/types";

type ListProps = {
  data: Faculty[];
};

export default function ListFaculties({ data }: ListProps) {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((el, i) => (
        <FacultyLinkButton props={el} key={i} />
      ))}
    </div>
  );
}
