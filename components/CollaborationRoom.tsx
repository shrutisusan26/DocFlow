"use client";

import type { ReactNode } from "react";
import {
  HocuspocusProviderWebsocketComponent,
  HocuspocusRoom,
  useHocuspocusConnectionStatus,
} from "@hocuspocus/provider-react";

type CollaborationRoomProps = {
  documentId: string;
  children: ReactNode;
};

export function CollaborationRoom({
  documentId,
  children,
}: CollaborationRoomProps) {
  return (
    <HocuspocusProviderWebsocketComponent url="ws://localhost:1234">
      <HocuspocusRoom
        name={`document.${documentId}`}
      >
        <ConnectionStatus />

        {children}
      </HocuspocusRoom>
    </HocuspocusProviderWebsocketComponent>
  );
}

function ConnectionStatus() {
  const status =
    useHocuspocusConnectionStatus();

  return (
    <p className="mb-4 text-sm text-slate-500">
      Collaboration:{" "}
      <span
        className={
          status === "connected"
            ? "text-emerald-600"
            : status === "connecting"
              ? "text-amber-600"
              : "text-red-600"
        }
      >
        {status}
      </span>
    </p>
  );
}