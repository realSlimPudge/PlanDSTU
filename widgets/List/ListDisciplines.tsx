import { motion } from "framer-motion";
import DisciplineLinkButton from "./LinkButton/DisciplineLinkButton";
import { Discipline } from "./Types/types";

type ListProps = {
  data: Discipline[];
};

export default function ListDisciplines({ data }: ListProps) {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          transition={{ delay: 0.1 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl shadow-sm"
        >
          <DisciplineLinkButton props={el} key={i} />
        </motion.div>
      ))}
    </div>
  );
}
