import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const sampleDocuments = [
  {
    id: "1",
    title: "Product planning notes",
    updatedAt: "Updated 2 hours ago",
  },
  {
    id: "2",
    title: "Engineering interview prep",
    updatedAt: "Updated yesterday",
  },
  {
    id: "3",
    title: "Project ideas",
    updatedAt: "Updated 3 days ago",
  },
];

export default function DashboardPage() {
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

          <Button>New document</Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleDocuments.map((document) => (
            <Link key={document.id} href={`/documents/${document.id}`}>
              <Card className="h-full p-6 transition hover:border-slate-600">
                <h2 className="text-lg font-semibold">{document.title}</h2>
                <p className="mt-3 text-sm text-slate-400">
                  {document.updatedAt}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}