"use client";

import { useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import WysiwygEditor from "./base";

/**
 * Example usage of the WYSIWYG Editor component
 * This demonstrates how to use the editor with controlled state
 */
export default function WysiwygEditorExample() {
  const [content, setContent] = useState("<p>Type something here...</p>");

  const handleSave = () => {
    console.log("Saved content:", content);
    alert("Content saved! Check console for HTML output.");
  };

  const handleClear = () => {
    setContent("");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        WYSIWYG Editor Example
      </Typography>
      
      <Stack spacing={2}>
        <Paper elevation={0}>
          <WysiwygEditor
            value={content}
            onChange={setContent}
            placeholder="Start typing..."
            minHeight={300}
            maxHeight={600}
          />
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSave}>
            Save Content
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear Content
          </Button>
        </Stack>

        <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
          <Typography variant="subtitle2" gutterBottom>
            HTML Output:
          </Typography>
          <Typography
            component="pre"
            sx={{
              overflow: "auto",
              fontSize: "0.875rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {content}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}
