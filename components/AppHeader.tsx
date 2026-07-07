import Link from "next/link";
import { Button } from "./ui/Button";

type AppHeaderProps = {
  showLogout?: boolean;
};

export function AppHeader({ showLogout = false }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-bold tracking-tight">
          DocFlow
        </Link>

        {showLogout ? (
          <Button variant="ghost">Log out</Button>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}