type DocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm text-slate-400">Document ID</p>
            <h1 className="text-xl font-bold">{id}</h1>
          </div>

          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950">
            Save
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="min-h-[600px] rounded-2xl border border-slate-800 bg-white p-10 text-slate-950 shadow-xl">
          <h2 className="text-3xl font-bold outline-none">
            Untitled document
          </h2>

          <p className="mt-6 leading-8 text-slate-700">
            This is where the rich-text editor will go later. For now, this page
            proves that our dynamic document route works.
          </p>
        </div>
      </section>
    </main>
  );
}