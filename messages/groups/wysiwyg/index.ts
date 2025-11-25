import { _m, MessagesGroup } from "../../types";

export const wysiwygMessages = new MessagesGroup({
  // Formatting
  bold: _m("Bold", "عريض"),
  italic: _m("Italic", "مائل"),
  underline: _m("Underline", "تحته خط"),
  strike: _m("Strike", "يتوسطه خط"),
  code: _m("Code", "كود"),
  
  // Headings
  heading: _m("Heading", "عنوان"),
  heading1: _m("Heading 1", "عنوان 1"),
  heading2: _m("Heading 2", "عنوان 2"),
  heading3: _m("Heading 3", "عنوان 3"),
  heading4: _m("Heading 4", "عنوان 4"),
  heading5: _m("Heading 5", "عنوان 5"),
  heading6: _m("Heading 6", "عنوان 6"),
  paragraph: _m("Paragraph", "فقرة"),
  
  // Lists
  bulletList: _m("Bullet list", "قائمة نقطية"),
  orderedList: _m("Ordered list", "قائمة مرقمة"),
  
  // Alignment
  alignLeft: _m("Align left", "محاذاة لليسار"),
  alignCenter: _m("Align center", "محاذاة للوسط"),
  alignRight: _m("Align right", "محاذاة لليمين"),
  alignJustify: _m("Justify", "ضبط"),
  
  // Actions
  undo: _m("Undo", "تراجع"),
  redo: _m("Redo", "إعادة"),
  
  // Colors
  textColor: _m("Text color", "لون النص"),
  highlightColor: _m("Highlight color", "لون التمييز"),
  
  // Links
  link: _m("Link", "رابط"),
  unlink: _m("Remove link", "إزالة الرابط"),
  editLink: _m("Edit link", "تعديل الرابط"),
  openLink: _m("Open link", "فتح الرابط"),
  
  // Images
  image: _m("Image", "صورة"),
  insertImage: _m("Insert image", "إدراج صورة"),
  
  // Code blocks
  codeBlock: _m("Code block", "كتلة كود"),
  
  // Quote
  blockquote: _m("Quote", "اقتباس"),
  
  // Other
  clearFormatting: _m("Clear formatting", "مسح التنسيق"),
  horizontalRule: _m("Horizontal rule", "خط أفقي"),
});
