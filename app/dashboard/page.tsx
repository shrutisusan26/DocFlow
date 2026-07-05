import Link from "next/link";

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
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            DocFlow
          </Link>

          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900">
            Log out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Your documents</h1>
            <p className="mt-2 text-slate-400">
              Create, edit, and manage your collaborative documents.
            </p>
          </div>

          <button className="rounded-lg bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200">
            New document
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleDocuments.map((document) => (
            <Link
              key={document.id}
              href={`/documents/${document.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-600"
            >
              <h2 className="text-lg font-semibold">{document.title}</h2>
              <p className="mt-3 text-sm text-slate-400">
                {document.updatedAt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}