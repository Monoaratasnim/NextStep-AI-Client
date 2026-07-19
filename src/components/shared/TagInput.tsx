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
      <label className="block text-sm font-medium text-[#A1A1AA]">
        {label}
      </label>
      <div
        className={`flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl bg-[#111111] border border-[#27272A] px-3 py-2 transition-colors duration-200 ${
          error
            ? "border-rose-500/50"
            : "focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/20 focus-within:ring-offset-1"
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-[#4F46E5]/10 px-2.5 py-1 text-xs font-medium text-[#4F46E5]"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-0.5 text-[#71717A] hover:text-white transition-colors"
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
            className="min-w-[120px] flex-1 bg-transparent py-1 text-sm text-white placeholder:text-[#71717A] focus:outline-none"
          />
        )}
      </div>
      {!disabled && tags.length > 0 && (
        <button
          type="button"
          onClick={addTag}
          disabled={!input.trim()}
          className="flex items-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      )}
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
