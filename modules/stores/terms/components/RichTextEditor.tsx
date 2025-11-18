"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "أدخل المحتوى هنا...",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[250px] p-6 text-white prose-headings:text-white prose-p:text-white prose-ul:text-white prose-ol:text-white prose-blockquote:text-white",
        style: "font-family: inherit; font-size: 14px; line-height: 1.8;",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync editor content with prop value when it changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!isMounted || !editor) {
    return (
      <div className="w-full">
        <div className="relative bg-sidebar border border-[#3d3d5c] rounded-lg overflow-hidden">
          <div className="min-h-[250px] p-6 bg-transparent text-white">
            <div className="text-gray-600">{placeholder || "أدخل المحتوى هنا..."}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative bg-sidebar border border-[#3d3d5c] rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-[#3d3d5c] bg-[#1a1a2e]">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("bold")
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("italic")
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("underline")
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            <u>U</u>
          </button>
          <div className="w-px h-6 bg-[#3d3d5c]" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            H3
          </button>
          <div className="w-px h-6 bg-[#3d3d5c]" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("bulletList")
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("orderedList")
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            1. List
          </button>
          <div className="w-px h-6 bg-[#3d3d5c]" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive("blockquote")
                ? "bg-pink-600 text-white"
                : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            "
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
          >
            ─
          </button>
          <div className="w-px h-6 bg-[#3d3d5c]" />
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↷
          </button>
        </div>
        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .ProseMirror {
            outline: none;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #6b7280;
            pointer-events: none;
            height: 0;
          }
          .ProseMirror h1 {
            font-size: 2em;
            font-weight: bold;
            margin-top: 0.67em;
            margin-bottom: 0.67em;
            color: white;
          }
          .ProseMirror h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 0.83em;
            margin-bottom: 0.83em;
            color: white;
          }
          .ProseMirror h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin-top: 1em;
            margin-bottom: 1em;
            color: white;
          }
          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5em;
            margin: 1em 0;
            color: white;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #ec4899;
            padding-left: 1em;
            margin: 1em 0;
            font-style: italic;
            color: white;
          }
          .ProseMirror hr {
            border: none;
            border-top: 2px solid #3d3d5c;
            margin: 1em 0;
          }
          .ProseMirror strong {
            font-weight: bold;
          }
          .ProseMirror em {
            font-style: italic;
          }
          .ProseMirror u {
            text-decoration: underline;
          }
          .ProseMirror p {
            color: white;
            margin: 0.5em 0;
          }
        `
      }} />
    </div>
  );
}
