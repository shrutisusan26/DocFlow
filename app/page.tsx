import { AppHeader } from "@/components/AppHeader";
import { LinkButton } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl flex-col items-center justify-center px-6 text-center">
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
          <LinkButton href="/register">Get started</LinkButton>
          <LinkButton href="/login" variant="secondary">
            Log in
          </LinkButton>
        </div>
      </section>
    </main>
  );
}