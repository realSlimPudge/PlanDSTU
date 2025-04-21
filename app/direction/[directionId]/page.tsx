"use client";

import { useParams } from "next/navigation";

export default function DirectionPage() {
  const { directionId } = useParams<{ directionId: string }>();
  const decoded = decodeURIComponent(directionId);
  return (
    <section className="w-[70%] mx-auto pt-40 pb-20">
      <div>{decoded}</div>
    </section>
  );
}
