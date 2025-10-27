"use client";

import React, { useState, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);

  // Sync local state with prop value when it changes
  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="w-full">
      {/* Text Area with Toolbar Inside */}
      <div className="relative bg-sidebar border border-[#3d3d5c] rounded-lg  overflow-hidden">
        {/* Text Area */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full min-h-[250px] p-6  bg-transparent text-white placeholder:text-gray-600 focus:outline-none resize-none"
          style={{
            fontFamily: "inherit",
            fontSize: "14px",
            lineHeight: "1.8",
          }}
        />
      </div>
    </div>
  );
}
