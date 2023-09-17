'use client'

import React from "react";

import Editor from "@monaco-editor/react";

function EventEditor() {
  return (
    <Editor
      defaultLanguage="json"
      defaultValue='{ "content" : "foo" }'
    />
  );
}

export default EventEditor;