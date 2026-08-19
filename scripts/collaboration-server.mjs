import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import StarterKit from "@tiptap/starter-kit";
import * as Y from "yjs";

const prisma = new PrismaClient();

function getDocumentId(documentName) {
  const prefix = "document.";

  if (!documentName.startsWith(prefix)) {
    return null;
  }

  return documentName.slice(prefix.length);
}

const collaborationServer = new Server({
  port: 1234,

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const documentId =
          getDocumentId(documentName);
      
        if (!documentId) {
          return null;
        }
      
        const document =
          await prisma.document.findUnique({
            where: {
              id: documentId,
            },
            select: {
              content: true,
              yjsState: true,
            },
          });
      
        if (!document) {
          return null;
        }
      
        if (document.yjsState) {
          console.log(
            `Loaded Yjs state for ${documentName}`
          );
      
          return new Uint8Array(
            document.yjsState
          );
        }
      
        if (!document.content) {
          return null;
        }
      
        const ydoc = TiptapTransformer.toYdoc(
          document.content,
          "default",
          [StarterKit]
        );
      
        const initialState =
          Y.encodeStateAsUpdate(ydoc);
      
        await prisma.document.update({
          where: {
            id: documentId,
          },
          data: {
            yjsState: initialState,
          },
        });
      
        console.log(
          `Converted existing content for ${documentName}`
        );
      
        return initialState;
      },

      store: async ({
        documentName,
        state,
      }) => {
        const documentId =
          getDocumentId(documentName);

        if (!documentId) {
          return;
        }

        const result =
          await prisma.document.updateMany({
            where: {
              id: documentId,
            },
            data: {
              yjsState: state,
            },
          });

        if (result.count > 0) {
          console.log(
            `Stored Yjs state for ${documentName}`
          );
        }
      },
    }),
  ],
});

collaborationServer.listen();

async function shutDown() {
  await collaborationServer.destroy();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);