"use client";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";
// @ts-ignore
import "@blocknote/core/fonts/inter.css";
// @ts-ignore
import "@blocknote/mantine/style.css";

interface EditorProps {
  initialContent?: string;
  onChange: (markdown: string) => void;
  isEdible: boolean;
}

export default function Editor({ initialContent, onChange, isEdible }: EditorProps) {
  const editor = useCreateBlockNote();

  // โหลด Markdown เข้าสู่ Editor ครั้งแรกครั้งเดียว
  useEffect(() => {
    async function loadInitial() {
      if (initialContent) {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]); // ไม่ใส่ initialContent ในนี้เพื่อป้องกัน Loop

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      editable={isEdible}
      onChange={async () => {
        // ทุกครั้งที่พิมพ์ จะแปลง Block เป็น Markdown String
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        onChange(markdown);
      }}
    />
  );
}