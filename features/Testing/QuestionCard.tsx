import type { Question } from "./types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type QuestionProps = {
  question: Question;
  selected: string | null;
  onSelect: (label: string) => void;
};

export default function QuestionCard({
  question,
  selected,
  onSelect,
}: QuestionProps) {
  return (
    <div className="space-y-2 w-full">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {question.text}
      </h2>

      <Select value={selected || ""} onValueChange={(value) => onSelect(value)}>
        <SelectTrigger className="overflow-hidden w-full border focus:ring-2 bg-gray-color-3 text-text-color dark:bg-gray-color-3 hover:bg-gray-color-2 focus:ring-primary-color">
          <SelectValue placeholder="Выберите ответ" className="pr-2 truncate" />
        </SelectTrigger>
        <SelectContent
          className="w-full border-0 max-w-[90vw] bg-gray-color-3 md:max-w-[500px]"
          position="popper"
          sideOffset={4}
        >
          <SelectGroup>
            <SelectLabel>Варианты ответа</SelectLabel>
            {question.options.map((opt) => (
              <SelectItem
                key={opt.label}
                value={opt.label}
                className="flex py-2 dark:hover:bg-gray-700 hover:bg-gray-color-2"
              >
                <div className="flex flex-wrap items-start">
                  <span className="flex-shrink-0 mr-2 font-semibold text-text-color">
                    {opt.label}.
                  </span>
                  <span className="flex-1 whitespace-normal break-words text-text-color">
                    {opt.text}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
