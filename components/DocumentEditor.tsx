"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  EditorContent,
  useEditor,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type DocumentEditorProps = {
  initialContent: JSONContent;
  editable: boolean;
  onChange: (content: JSONContent) => void;
};

export function DocumentEditor({
  initialContent,
  editable,
  onChange,
}: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[620px] outline-none " +
          "[&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold " +
          "[&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold " +
          "[&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold " +
          "[&_p]:mb-3 [&_p]:leading-8 " +
          "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 " +
          "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 " +
          "[&_blockquote]:pl-4 [&_blockquote]:italic",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  if (!editor) {
    return (
      <p className="text-slate-500">
        Loading editor...
      </p>
    );
  }

  return (
    <div>
      {editable && (
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
          >
            Bold
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
          >
            Italic
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("heading", {
              level: 1,
            })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run()
            }
          >
            H1
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("heading", {
              level: 2,
            })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
          >
            H2
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
          >
            Bullets
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
          >
            Numbered
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().undo().run()
            }
            disabled={!editor.can().undo()}
          >
            Undo
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().redo().run()
            }
            disabled={!editor.can().redo()}
          >
            Redo
          </ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

type ToolbarButtonProps = {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-md border px-3 py-2 text-sm font-medium transition",
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}