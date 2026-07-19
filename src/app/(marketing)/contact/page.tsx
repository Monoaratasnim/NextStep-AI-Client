import React from "react";

export default function ContactPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white dark:bg-black">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Contact Us</h1>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Have questions or feedback? Reach out to us at contact@nextstepai.com. We&apos;d love to hear from you.
        </p>
      </div>
    </div>
  );
}
