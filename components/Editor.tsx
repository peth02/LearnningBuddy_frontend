"use client";
import { BlockNoteEditor } from "@blocknote/core";
import {
  filterSuggestionItems,
} from "@blocknote/core/extensions";
import {
  SuggestionMenuController,
  DefaultReactSuggestionItem,
  FormattingToolbarController,
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
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

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor,
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor).filter((item) => item.group !== "Media"),
];

export default function Editor({
  initialContent,
  onChange,
  isEdible,
}: EditorProps) {
  const editor = useCreateBlockNote();

  useEffect(() => {
    async function loadInitial() {
      if (initialContent) {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      }
    }
    loadInitial();
  }, [editor]);

  return (
    <BlockNoteView
      className=" border border-gray-300 rounded-md focus:ring-2 min-h-100 max-h-200 overflow-y-auto"
      editor={editor}
      theme="light"
      editable={isEdible}
      slashMenu={false}
      onChange={async () => {
        // ทุกครั้งที่พิมพ์ จะแปลง Block เป็น Markdown String
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        onChange(markdown);
      }}
    >
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
      />
      {/* <FormattingToolbarController /> */}
    </BlockNoteView>
  );
}
