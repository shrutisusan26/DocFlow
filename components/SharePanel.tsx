"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type SharingRole = "EDITOR" | "VIEWER";

type UserSummary = {
  id: string;
  name: string;
  email: string;
};

type Permission = {
  id: string;
  role: SharingRole;
  user: UserSummary;
};

type SharePanelProps = {
  documentId: string;
  onClose: () => void;
};

export function SharePanel({
  documentId,
  onClose,
}: SharePanelProps) {
  const [owner, setOwner] =
    useState<UserSummary | null>(null);
  const [permissions, setPermissions] = useState<
    Permission[]
  >([]);
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<SharingRole>("EDITOR");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPermissions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/documents/${documentId}/permissions`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Unable to load permissions"
        );
      }

      setOwner(data.owner);
      setPermissions(data.permissions);
    } catch (error) {
      console.error("Load sharing error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load sharing information"
      );
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  async function handleShare(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/documents/${documentId}/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Unable to share document"
        );
      }

      setEmail("");
      setMessage("Document access updated.");
      await loadPermissions();
    } catch (error) {
      console.error("Share document error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to share document"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2
            id="share-dialog-title"
            className="text-xl font-semibold"
          >
            Share document
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sharing dialog"
            className="rounded-md px-3 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleShare}
          className="mt-6 space-y-4"
        >
          <Input
            label="Collaborator email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="teammate@example.com"
            required
            disabled={isSubmitting}
          />

          <div>
            <label
              htmlFor="sharing-role"
              className="text-sm font-medium text-slate-300"
            >
              Permission
            </label>

            <select
              id="sharing-role"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as SharingRole
                )
              }
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            >
              <option value="EDITOR">
                Editor — can make changes
              </option>

              <option value="VIEWER">
                Viewer — read only
              </option>
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg border border-emerald-900 bg-emerald-950/50 p-3 text-sm text-emerald-300">
              {message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Updating access..."
              : "Share document"}
          </Button>
        </form>

        <div className="mt-8 border-t border-slate-800 pt-6">
          <h3 className="text-sm font-semibold text-slate-300">
            People with access
          </h3>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-400">
              Loading...
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {owner && (
                <AccessRow
                  user={owner}
                  role="OWNER"
                />
              )}

              {permissions.map((permission) => (
                <AccessRow
                  key={permission.id}
                  user={permission.user}
                  role={permission.role}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type AccessRowProps = {
  user: UserSummary;
  role: "OWNER" | SharingRole;
};

function AccessRow({
  user,
  role,
}: AccessRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {user.name}
        </p>

        <p className="truncate text-xs text-slate-400">
          {user.email}
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
        {role}
      </span>
    </div>
  );
}