import React from "react";

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white dark:bg-black">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">About NextStep AI</h1>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          We are committed to helping tech professionals navigate their career transitions with ease using advanced artificial intelligence.
        </p>
      </div>
    </div>
  );
}
