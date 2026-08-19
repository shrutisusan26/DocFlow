"use client";

import Collaboration from "@tiptap/extension-collaboration";
import {
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useHocuspocusProvider } from "@hocuspocus/provider-react";

export function RealtimeDemoEditor() {
  const provider = useHocuspocusProvider();

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          undoRedo: false,
        }),

        Collaboration.configure({
          document: provider.document,
        }),
      ],

      immediatelyRender: false,

      editorProps: {
        attributes: {
          class:
            "min-h-[400px] rounded-xl border border-slate-300 bg-white p-6 text-slate-950 outline-none",
        },
      },
    },
    [provider]
  );

  if (!editor) {
    return (
      <p className="text-slate-400">
        Loading collaborative editor...
      </p>
    );
  }

  return <EditorContent editor={editor} />;
}