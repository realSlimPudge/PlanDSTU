import { motion } from "framer-motion";
import FacultyLinkButton from "./LinkButton/FacultyLinkButton";
import { Faculty } from "./Types/types";

type ListProps = {
  data: Faculty[];
};

export default function ListFaculties({ data }: ListProps) {
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
          <FacultyLinkButton props={el} />
        </motion.div>
      ))}
    </div>
  );
}
