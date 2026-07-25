"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type DocumentSummary = {
  id: string;
  title: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await fetch("/api/documents");

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load documents");
        }

        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error("Load documents error:", error);
        setError("We could not load your documents.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, [router]);

  async function handleCreateDocument() {
    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to create document");
      }

      const data = await response.json();
      router.push(`/documents/${data.document.id}`);
    } catch (error) {
      console.error("Create document error:", error);
      setError("We could not create a new document.");
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader showLogout />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Your documents</h1>
            <p className="mt-2 text-slate-400">
              Create, edit, and manage your collaborative documents.
            </p>
          </div>

          <Button
            onClick={handleCreateDocument}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "New document"}
          </Button>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="mt-8 text-slate-400">
            Loading documents...
          </p>
        ) : documents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-12 text-center">
            <h2 className="text-xl font-semibold">
              No documents yet
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first document to get started.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <Link
                key={document.id}
                href={`/documents/${document.id}`}
              >
                <Card className="h-full p-6 transition hover:border-slate-600">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold">
                      {document.title}
                    </h2>

                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {document.role}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    Updated{" "}
                    {new Date(
                      document.updatedAt
                    ).toLocaleString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}