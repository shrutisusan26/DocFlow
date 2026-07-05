import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          Real-time document collaboration for modern teams
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Write, share, and collaborate on documents in real time.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          DocFlow is a production-style collaborative document editor inspired
          by Google Docs. Create documents, invite teammates, manage
          permissions, and edit together.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Get started
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-900"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}