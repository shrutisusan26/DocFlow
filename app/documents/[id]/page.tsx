"use client";

import type { JSONContent } from "@tiptap/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DocumentEditor } from "@/components/DocumentEditor";
import { SharePanel } from "@/components/SharePanel";
import { Button } from "@/components/ui/Button";
import { CollaborationRoom } from "@/components/CollaborationRoom";
type DocumentRole = "OWNER" | "EDITOR" | "VIEWER";

type DocumentData = {
  id: string;
  title: string;
  content: unknown;
  ownerId: string;
  role: DocumentRole;
  createdAt: string;
  updatedAt: string;
};

type SaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";

function normalizeContent(
  content: unknown
): JSONContent {
  if (
    content !== null &&
    typeof content === "object" &&
    !Array.isArray(content)
  ) {
    const contentObject = content as Record<
      string,
      unknown
    >;

    // The document already uses Tiptap JSON.
    if (contentObject.type === "doc") {
      return contentObject as JSONContent;
    }

    // Convert our older { text: "..." } format.
    if (typeof contentObject.text === "string") {
      const text = contentObject.text;

      return {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: text
              ? [
                  {
                    type: "text",
                    text,
                  },
                ]
              : undefined,
          },
        ],
      };
    }
  }

  // A new or empty document.
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}

export default function DocumentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const documentId = params.id;

  const [document, setDocument] =
    useState<DocumentData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] =
    useState<JSONContent>({
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");
  const [isShareOpen, setIsShareOpen] =
    useState(false);

  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await fetch(
          `/api/documents/${documentId}`
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (response.status === 404) {
          setLoadError(
            "This document does not exist or you do not have access to it."
          );
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load document");
        }

        const data = await response.json();
        const loadedDocument =
          data.document as DocumentData;

        setDocument(loadedDocument);
        setTitle(loadedDocument.title);
        setContent(
          normalizeContent(loadedDocument.content)
        );
      } catch (error) {
        console.error("Load document error:", error);

        setLoadError(
          "We could not load this document."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDocument();
  }, [documentId, router]);

  async function handleSave() {
    if (!document || document.role === "VIEWER") {
      return;
    }

    if (!title.trim()) {
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");

    try {
      const response = await fetch(
        `/api/documents/${documentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 403) {
        setSaveStatus("error");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to save document");
      }

      const data = await response.json();
      const savedDocument =
        data.document as DocumentData;

      setDocument(savedDocument);
      setTitle(savedDocument.title);
      setContent(
        normalizeContent(savedDocument.content)
      );
      setSaveStatus("saved");
    } catch (error) {
      console.error("Save document error:", error);
      setSaveStatus("error");
    }
  }

  const canEdit =
    document?.role === "OWNER" ||
    document?.role === "EDITOR";

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading document...
      </main>
    );
  }

  if (loadError || !document) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <h1 className="text-2xl font-bold">
          Document unavailable
        </h1>

        <p className="mt-3 max-w-md text-slate-400">
          {loadError}
        </p>

        <Link
          href="/dashboard"
          className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950"
        >
          Return to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/dashboard"
              className="shrink-0 text-sm text-slate-400 transition hover:text-white"
            >
              ← Dashboard
            </Link>

            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setSaveStatus("idle");
              }}
              disabled={!canEdit}
              aria-label="Document title"
              className="min-w-0 flex-1 border-none bg-transparent text-xl font-semibold outline-none disabled:text-slate-300"
            />
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {document.role}
            </span>

            {document.role === "OWNER" && (
              <Button
                variant="secondary"
                onClick={() => setIsShareOpen(true)}
              >
                Share
              </Button>
            )}

            {saveStatus === "saved" && (
              <span className="text-sm text-emerald-400">
                Saved
              </span>
            )}

            {saveStatus === "error" && (
              <span className="text-sm text-red-400">
                Save failed
              </span>
            )}

            {canEdit && (
              <Button
                onClick={handleSave}
                disabled={
                  saveStatus === "saving" ||
                  !title.trim()
                }
              >
                {saveStatus === "saving"
                  ? "Saving..."
                  : "Save"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="min-h-[700px] rounded-2xl bg-white p-10 text-slate-950 shadow-xl">
        <CollaborationRoom documentId={document.id}>
          <DocumentEditor
            initialContent={content}
            editable={canEdit}
            onChange={(updatedContent) => {
              setContent(updatedContent);
              setSaveStatus("idle");
            }}
          />
        </CollaborationRoom>
        </div>
      </section>

      {isShareOpen && (
        <SharePanel
          documentId={document.id}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </main>
  );
}