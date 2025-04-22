"use client";
import { useParams } from "next/navigation";

export default function RoadmapPage() {
  const { disciplineName, disciplineLink } = useParams<{
    disciplineName: string;
    disciplineLink: string;
  }>();

  const decodedName = decodeURIComponent(disciplineName);

  return (
    <div className="pt-40">
      {disciplineLink}, {decodedName}
    </div>
  );
}
