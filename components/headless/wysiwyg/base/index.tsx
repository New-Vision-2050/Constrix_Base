"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  useTheme,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  List,
  ListOrdered,
  Quote,
  FileCode,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
} from "lucide-react";

export interface WysiwygEditorProps {
  /**
   * The HTML content value of the editor
   */
  value?: string;

  /**
   * Callback fired when the editor content changes
   */
  onChange?: (html: string) => void;

  /**
   * Whether the editor is in read-only mode
   */
  readOnly?: boolean;

  /**
   * Placeholder text when editor is empty
   */
  placeholder?: string;

  /**
   * Minimum height of the editor
   */
  minHeight?: number | string;

  /**
   * Maximum height of the editor
   */
  maxHeight?: number | string;
}

export default function WysiwygEditor({
  value = "",
  onChange,
  readOnly = false,
  placeholder = "",
  minHeight = 200,
  maxHeight,
}: WysiwygEditorProps) {
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Update content when value changes externally
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [readOnly, editor]);

  if (!editor) {
    return null;
  }

  const handleHeadingChange = (event: SelectChangeEvent<string>) => {
    const level = event.target.value;
    if (level === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6 })
        .run();
    }
  };

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    if (editor.isActive("heading", { level: 4 })) return "4";
    if (editor.isActive("heading", { level: 5 })) return "5";
    if (editor.isActive("heading", { level: 6 })) return "6";
    return "paragraph";
  };

  const getCurrentAlignment = () => {
    if (editor.isActive({ textAlign: "left" })) return "left";
    if (editor.isActive({ textAlign: "center" })) return "center";
    if (editor.isActive({ textAlign: "right" })) return "right";
    if (editor.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      {!readOnly && (
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            p: 1,
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {/* Undo/Redo */}
            <Box>
              <Tooltip title="Undo">
                <IconButton
                  size="small"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo2 size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton
                  size="small"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Heading Select */}
            <Select
              size="small"
              value={getCurrentHeading()}
              onChange={handleHeadingChange}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="paragraph">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Type size={16} />
                  <span>Paragraph</span>
                </Stack>
              </MenuItem>
              <MenuItem value="1">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Heading1 size={16} />
                  <span>Heading 1</span>
                </Stack>
              </MenuItem>
              <MenuItem value="2">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Heading2 size={16} />
                  <span>Heading 2</span>
                </Stack>
              </MenuItem>
              <MenuItem value="3">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Heading3 size={16} />
                  <span>Heading 3</span>
                </Stack>
              </MenuItem>
              <MenuItem value="4">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Heading4 size={16} />
                  <span>Heading 4</span>
                </Stack>
              </MenuItem>
              <MenuItem value="5">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Heading5 size={16} />
                  <span>Heading 5</span>
                </Stack>
              </MenuItem>
              <MenuItem value="6">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Heading6 size={16} />
                  <span>Heading 6</span>
                </Stack>
              </MenuItem>
            </Select>

            <Divider orientation="vertical" flexItem />

            {/* Text Formatting */}
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="bold"
                selected={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Tooltip title="Bold">
                  <Bold size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="italic"
                selected={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Tooltip title="Italic">
                  <Italic size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="underline"
                selected={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <Tooltip title="Underline">
                  <UnderlineIcon size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="strike"
                selected={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <Tooltip title="Strikethrough">
                  <Strikethrough size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="code"
                selected={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >
                <Tooltip title="Code">
                  <CodeIcon size={18} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Lists */}
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="bulletList"
                selected={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <Tooltip title="Bullet List">
                  <List size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="orderedList"
                selected={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <Tooltip title="Ordered List">
                  <ListOrdered size={18} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Alignment */}
            <ToggleButtonGroup
              size="small"
              value={getCurrentAlignment()}
              exclusive
            >
              <ToggleButton
                value="left"
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <Tooltip title="Align Left">
                  <AlignLeft size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="center"
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <Tooltip title="Align Center">
                  <AlignCenter size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="right"
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <Tooltip title="Align Right">
                  <AlignRight size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="justify"
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
              >
                <Tooltip title="Justify">
                  <AlignJustify size={18} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Block Elements */}
            <ToggleButtonGroup size="small">
              <ToggleButton
                value="blockquote"
                selected={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <Tooltip title="Blockquote">
                  <Quote size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="codeBlock"
                selected={editor.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              >
                <Tooltip title="Code Block">
                  <FileCode size={18} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="horizontalRule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Tooltip title="Horizontal Rule">
                  <Minus size={18} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
      )}

      {/* Editor Content */}
      <Box
        sx={{
          "& .ProseMirror": {
            minHeight,
            maxHeight,
            overflowY: maxHeight ? "auto" : "visible",
            padding: theme.spacing(2),
            outline: "none",
            direction: theme.direction,

            "&.ProseMirror-focused": {
              outline: "none",
            },

            // Placeholder
            "&.tiptap p.is-editor-empty:first-of-type::before": {
              content: `"${placeholder}"`,
              color: theme.palette.text.disabled,
              float: "left",
              height: 0,
              pointerEvents: "none",
            },

            // Content styling
            "& p": {
              margin: 0,
              marginBottom: theme.spacing(1),
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(1),
              fontWeight: 600,
            },
            "& h1": { fontSize: "2em" },
            "& h2": { fontSize: "1.5em" },
            "& h3": { fontSize: "1.25em" },
            "& h4": { fontSize: "1.1em" },
            "& h5": { fontSize: "1em" },
            "& h6": { fontSize: "0.9em" },
            "& ul, & ol": {
              paddingLeft: theme.spacing(3),
              marginBottom: theme.spacing(1),
            },
            "& blockquote": {
              borderLeft: `3px solid ${theme.palette.primary.main}`,
              paddingLeft: theme.spacing(2),
              marginLeft: 0,
              marginRight: 0,
              color: theme.palette.text.secondary,
              fontStyle: "italic",
            },
            "& code": {
              backgroundColor: theme.palette.action.hover,
              padding: theme.spacing(0.25, 0.5),
              borderRadius: `${theme.shape.borderRadius}px`,
              fontFamily: "monospace",
              fontSize: "0.9em",
            },
            "& pre": {
              backgroundColor: theme.palette.action.hover,
              padding: theme.spacing(2),
              borderRadius: `${theme.shape.borderRadius}px`,
              overflowX: "auto",
              "& code": {
                backgroundColor: "transparent",
                padding: 0,
              },
            },
            "& hr": {
              border: "none",
              borderTop: `2px solid ${theme.palette.divider}`,
              margin: theme.spacing(2, 0),
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: `${theme.shape.borderRadius}px`,
            },
            "& a": {
              color: theme.palette.primary.main,
              textDecoration: "underline",
              cursor: "pointer",
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}
