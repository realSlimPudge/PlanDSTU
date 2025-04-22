import DisciplineLinkButton from "./LinkButton/DisciplineLinkButton";
import { Discipline } from "./Types/types";

type ListProps = {
  data: Discipline[];
};

export default function ListDisciplines({ data }: ListProps) {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((el, i) => (
        <DisciplineLinkButton props={el} key={i} />
      ))}
    </div>
  );
}
