import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Start creating and sharing documents with DocFlow.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              type="text"
              placeholder="Shruti Mathews"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}