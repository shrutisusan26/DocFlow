import { CollaborationRoom } from "@/components/CollaborationRoom";
import { RealtimeDemoEditor } from "@/components/RealtimeDemoEditor";

export default function RealtimeDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          Real-time collaboration demo
        </h1>

        <p className="mt-2 text-slate-400">
          Open this page in two browser windows and
          type in either editor.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8">
          <CollaborationRoom documentId="cmszk7kvi0003vejztuwc6a96">
            <RealtimeDemoEditor />
          </CollaborationRoom>
        </div>
      </section>
    </main>
  );
}