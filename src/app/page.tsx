"use client"

import { Calendar24 } from "@/components/Time";

export default function Home() {
  return (
    <main className="min-w-screen min-h-screen flex flex-col justify-center items-center">
      <Calendar24 />
    </main>
  );
}
