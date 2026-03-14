"use client";

import { useRef, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ value, onChange, readOnly = false, height = "100%" }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Define Solidity language
    monaco.languages.register({ id: "sol" });
    monaco.languages.setMonarchTokensProvider("sol", {
      keywords: [
        "pragma", "solidity", "contract", "library", "interface", "function",
        "modifier", "event", "struct", "enum", "mapping", "address", "bool",
        "string", "bytes", "uint", "int", "uint8", "uint16", "uint32",
        "uint64", "uint128", "uint256", "int8", "int16", "int32", "int64",
        "int128", "int256", "bytes1", "bytes32", "public", "private",
        "internal", "external", "pure", "view", "payable", "returns",
        "return", "if", "else", "for", "while", "do", "break", "continue",
        "throw", "emit", "require", "assert", "revert", "memory", "storage",
        "calldata", "import", "from", "is", "new", "delete", "true", "false",
        "constant", "immutable", "override", "virtual", "abstract",
        "constructor", "receive", "fallback", "msg", "block", "tx", "this",
        "super",
      ],
      fhevmKeywords: [
        "euint8", "euint16", "euint32", "euint64", "euint128", "euint256",
        "eint8", "eint16", "eint32", "eint64", "eint128", "eint256",
        "ebool", "eaddress",
        "externalEuint8", "externalEuint16", "externalEuint32",
        "externalEuint64", "externalEuint128", "externalEuint256",
        "externalEbool", "externalEaddress",
        "externalEint8", "externalEint16", "externalEint32", "externalEint64",
      ],
      operators: [
        "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
        "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^",
        "%", "<<", ">>", "+=", "-=", "*=", "/=", "&=", "|=", "^=",
        "%=", "<<=", ">>=", "=>",
      ],
      symbols: /[=><!~?:&|+\-*/^%]+/,
      tokenizer: {
        root: [
          [/FHE\.\w+/, "fhevm-call"],
          [/[a-zA-Z_]\w*/, {
            cases: {
              "@keywords": "keyword",
              "@fhevmKeywords": "fhevm-type",
              "@default": "identifier",
            },
          }],
          { include: "@whitespace" },
          [/[{}()[\]]/, "@brackets"],
          [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
          [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
          [/0[xX][0-9a-fA-F]+/, "number.hex"],
          [/\d+/, "number"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
        ],
        whitespace: [
          [/[ \t\r\n]+/, "white"],
          [/\/\*/, "comment", "@comment"],
          [/\/\/.*$/, "comment"],
        ],
        comment: [
          [/[^/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[/*]/, "comment"],
        ],
      },
    });

    // Terminal/hacker theme
    monaco.editor.defineTheme("fhevm-terminal", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "C586C0" },
        { token: "fhevm-type", foreground: "FFC517", fontStyle: "bold" },
        { token: "fhevm-call", foreground: "00D4AA", fontStyle: "bold" },
        { token: "comment", foreground: "606060" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "operator", foreground: "E0E0E0" },
        { token: "identifier", foreground: "9CDCFE" },
      ],
      colors: {
        "editor.background": "#0A0A0A",
        "editor.foreground": "#E0E0E0",
        "editor.lineHighlightBackground": "#111111",
        "editor.selectionBackground": "#FFC51720",
        "editor.inactiveSelectionBackground": "#FFC51710",
        "editorLineNumber.foreground": "#5A5A5A",
        "editorLineNumber.activeForeground": "#C8C8C8",
        "editorCursor.foreground": "#FFC517",
        "editor.selectionHighlightBackground": "#FFC51715",
        "editorBracketMatch.background": "#FFC51720",
        "editorBracketMatch.border": "#FFC51750",
        "editorIndentGuide.background": "#1a1a1a",
        "editorWidget.background": "#111111",
        "editorWidget.border": "#1a1a1a",
        "input.background": "#111111",
        "input.border": "#1a1a1a",
        "scrollbarSlider.background": "#1a1a1a80",
        "scrollbarSlider.hoverBackground": "#2a2a2a80",
      },
    });

    monaco.editor.setTheme("fhevm-terminal");

    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: "on",
      renderLineHighlight: "line",
      padding: { top: 16, bottom: 16 },
      bracketPairColorization: { enabled: true },
      tabSize: 4,
      insertSpaces: true,
      wordWrap: "on",
      readOnly,
      domReadOnly: readOnly,
      cursorBlinking: "smooth",
      smoothScrolling: true,
      contextmenu: false,
    });
  }, [readOnly]);

  return (
    <Editor
      height={height}
      defaultLanguage="sol"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      loading={
        <div className="flex h-full items-center justify-center bg-[#0A0A0A]">
          <span className="text-[12px] text-[#808080] animate-pulse">loading editor...</span>
        </div>
      }
      options={{
        readOnly,
        domReadOnly: readOnly,
      }}
    />
  );
}
