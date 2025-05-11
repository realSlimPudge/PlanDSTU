import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Discipline } from "../Types/types";

type ButtonProps = {
  props: Discipline;
};

export default function DisciplineLinkButton({ props }: ButtonProps) {
  return (
    <Link
      href={`/roadmap/${props.name}/${props.link}`}
      className="w-full h-full group"
    >
      <div className="flex flex-col gap-y-3 py-5 px-8 rounded-3xl bg-element-bg text-text-color group">
        <div>
          <h5 className="text-xl font-semibold transition-colors duration-200 ease group-hover:text-text-link-color">
            {props.name}
          </h5>
          {props.course.trim() !== "" && props.course.trim() !== "" && (
            <p className="text-text-2-color">
              Курс: {props.course}, семестр: {props.semester}
            </p>
          )}
        </div>
        <p className="flex gap-x-2">
          Перейти к дисциплине{" "}
          <ChevronRight
            strokeWidth={2}
            className="transition duration-300 ease-in-out transform group-hover:translate-x-3"
          />{" "}
        </p>
      </div>
    </Link>
  );
}
