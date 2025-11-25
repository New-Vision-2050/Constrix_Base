# WYSIWYG Editor Component

A fully-featured WYSIWYG (What You See Is What You Get) rich text editor built with [mui-tiptap](https://github.com/sjdemartini/mui-tiptap), integrated with your MUI theme and supporting RTL languages.

## Features

- ✅ **Rich Text Formatting**: Bold, italic, underline, strikethrough, code
- ✅ **Headings**: H1-H6 support
- ✅ **Lists**: Bullet lists and ordered lists
- ✅ **Text Alignment**: Left, center, right, justify
- ✅ **Block Elements**: Blockquotes, code blocks, horizontal rules
- ✅ **Links**: Create and edit links with bubble menu
- ✅ **Images**: Insert images (base64 or URLs)
- ✅ **Undo/Redo**: Full history management
- ✅ **Bubble Menu**: Context menu appears when selecting text
- ✅ **MUI Theme Integration**: Automatically adapts to your light/dark theme
- ✅ **RTL Support**: Fully supports right-to-left languages
- ✅ **Internationalization**: Translated to English and Arabic

## Installation

The required packages are already installed:
- `mui-tiptap`
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-text-align`
- `@tiptap/extension-link`
- `@tiptap/extension-image`
- `@tiptap/extension-color`
- `@tiptap/extension-text-style`
- `@tiptap/extension-highlight`
- `@tiptap/extension-underline`

## Basic Usage

```tsx
import WysiwygEditor from "@/components/headless/wysiwyg";

function MyComponent() {
  const [content, setContent] = useState("<p>Hello world!</p>");

  return (
    <WysiwygEditor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The HTML content value of the editor (controlled) |
| `onChange` | `(html: string) => void` | `undefined` | Callback fired when content changes |
| `readOnly` | `boolean` | `false` | Whether the editor is in read-only mode |
| `placeholder` | `string` | `""` | Placeholder text when editor is empty |
| `minHeight` | `number \| string` | `200` | Minimum height of the editor in pixels |
| `maxHeight` | `number \| string` | `undefined` | Maximum height (enables scrolling) |

## Examples

### Controlled Editor with Form

```tsx
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import WysiwygEditor from "@/components/headless/wysiwyg";

function ArticleForm() {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    // Submit content to your API
    console.log("Article content:", content);
  };

  return (
    <Stack spacing={2}>
      <WysiwygEditor
        value={content}
        onChange={setContent}
        placeholder="Write your article..."
        minHeight={400}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Publish Article
      </Button>
    </Stack>
  );
}
```

### Read-Only Display

```tsx
<WysiwygEditor
  value={savedContent}
  readOnly={true}
/>
```

### With Custom Height

```tsx
<WysiwygEditor
  value={content}
  onChange={setContent}
  minHeight={300}
  maxHeight={600}
/>
```

### With React Hook Form

```tsx
import { Controller, useForm } from "react-hook-form";
import WysiwygEditor from "@/components/headless/wysiwyg";

function MyForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data.description);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <WysiwygEditor
            value={field.value}
            onChange={field.onChange}
            placeholder="Enter description..."
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Keyboard Shortcuts

The editor supports standard keyboard shortcuts:

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Bold | `Ctrl+B` | `Cmd+B` |
| Italic | `Ctrl+I` | `Cmd+I` |
| Underline | `Ctrl+U` | `Cmd+U` |
| Strike | `Ctrl+Shift+X` | `Cmd+Shift+X` |
| Code | `Ctrl+E` | `Cmd+E` |
| Heading 1 | `Ctrl+Alt+1` | `Cmd+Alt+1` |
| Heading 2 | `Ctrl+Alt+2` | `Cmd+Alt+2` |
| Bullet List | `Ctrl+Shift+8` | `Cmd+Shift+8` |
| Ordered List | `Ctrl+Shift+7` | `Cmd+Shift+7` |
| Blockquote | `Ctrl+Shift+B` | `Cmd+Shift+B` |
| Code Block | `Ctrl+Alt+C` | `Cmd+Alt+C` |
| Undo | `Ctrl+Z` | `Cmd+Z` |
| Redo | `Ctrl+Shift+Z` | `Cmd+Shift+Z` |

## Customization

### Extending the Editor

You can extend the base component by modifying `components/headless/wysiwyg/base/index.tsx` to add more Tiptap extensions or custom controls.

### Styling

The editor automatically uses your MUI theme. It supports:
- Light and dark mode
- Custom colors and fonts
- RTL direction
- Custom spacing and borders

## Translations

The editor UI is translated in:
- English (en)
- Arabic (ar)

Translations are managed in `messages/groups/wysiwyg/index.ts`.

## Browser Support

The editor works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid
- Flexbox

## Performance Notes

- The editor uses controlled state with `value` and `onChange` props
- For large documents (>10,000 characters), consider debouncing the `onChange` callback
- The editor re-renders when content changes externally

## Troubleshooting

### Content not updating
Make sure you're using the controlled pattern correctly:
```tsx
const [content, setContent] = useState("");
<WysiwygEditor value={content} onChange={setContent} />
```

### Styling issues
The editor inherits your MUI theme. Check that:
- Your app is wrapped in a `ThemeProvider`
- Theme is properly configured for light/dark mode

### RTL not working
Ensure your theme has `direction: 'rtl'` set when needed.

## See Also

- [Example Component](./example.tsx) - Full working example
- [mui-tiptap Documentation](https://github.com/sjdemartini/mui-tiptap)
- [Tiptap Documentation](https://tiptap.dev/)
