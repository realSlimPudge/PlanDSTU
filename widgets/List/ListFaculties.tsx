import FacultyLinkButton from "./LinkButton/FacultyLinkButton";
import { Falculty } from "./Types/types";

type ListProps = {
  data: Falculty[];
  isLoading: boolean;
};

export default function ListFaculties({ data, isLoading }: ListProps) {
  console.log(data);
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((el, i) => (
        <FacultyLinkButton props={el} key={i} />
      ))}
    </div>
  );
}
