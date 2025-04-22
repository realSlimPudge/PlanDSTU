import { MoveRight } from "lucide-react";
import Link from "next/link";
import { Faculty } from "../Types/types";

type ButtonProps = {
  props: Faculty;
};

export default function FacultyLinkButton({ props }: ButtonProps) {
  return (
    <Link href={`/faculties/${props.id}`} className="w-full h-full">
      <div className="flex flex-col gap-y-3 py-5 px-8 rounded-3xl bg-element-bg text-text-color group">
        <h5 className="text-xl font-semibold transition-colors duration-200 ease group-hover:text-text-link-color">
          {props.title}
        </h5>
        <p className="flex gap-x-2">
          Перейти к факультету <MoveRight strokeWidth={1} />{" "}
        </p>
      </div>
    </Link>
  );
}
