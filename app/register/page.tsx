import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Start creating and sharing documents with DocFlow.
        </p>

        <form className="mt-8 space-y-5">
          <Input
            label="Name"
            type="text"
            placeholder="Shruti Mathews"
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
          />

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}