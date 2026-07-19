"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder = "Type and press Enter",
  error,
  disabled = false,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div
        className={`flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border bg-white px-3 py-2 transition-colors duration-200 dark:bg-zinc-900 ${
          error
            ? "border-rose-300 dark:border-rose-700"
            : "border-zinc-200 focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20 focus-within:ring-offset-1 dark:border-zinc-800 dark:focus-within:border-zinc-600 dark:focus-within:ring-zinc-600/20"
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="min-w-[120px] flex-1 bg-transparent py-1 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        )}
      </div>
      {!disabled && tags.length > 0 && (
        <button
          type="button"
          onClick={addTag}
          disabled={!input.trim()}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      )}
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
