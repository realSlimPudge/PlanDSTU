import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FacultyDirection } from "../Types/types";

type ButtonProps = {
  props: FacultyDirection;
};

export default function DirectionLinkButton({ props }: ButtonProps) {
  return (
    <Link href={`/direction/${props.name}`} className="w-full h-full group">
      <div className="flex flex-col gap-y-3 py-5 px-8 rounded-3xl bg-element-bg text-text-color group">
        <h5 className="text-xl font-semibold transition-colors duration-200 ease group-hover:text-text-link-color">
          {props.name}
        </h5>
        <p className="flex gap-x-2">
          Перейти к направлению{" "}
          <ChevronRight
            strokeWidth={2}
            className="transition duration-300 ease-in-out transform group-hover:translate-x-3"
          />
        </p>
      </div>
    </Link>
  );
}
