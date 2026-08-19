import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

const documentA = new Y.Doc();
const documentB = new Y.Doc();

const providerA = new HocuspocusProvider({
  url: "ws://localhost:1234",
  name: "websocket-demo",
  document: documentA,
});

const providerB = new HocuspocusProvider({
  url: "ws://localhost:1234",
  name: "websocket-demo",
  document: documentB,
});

const textA = documentA.getText("content");
const textB = documentB.getText("content");

providerA.on("status", ({ status }) => {
  console.log("Browser A:", status);
});

providerB.on("status", ({ status }) => {
  console.log("Browser B:", status);
});

textA.observe((_event, transaction) => {
  if (!transaction.local) {
    console.log(
      "Browser A received:",
      textA.toString()
    );
  }
});

textB.observe((_event, transaction) => {
  if (!transaction.local) {
    console.log(
      "Browser B received:",
      textB.toString()
    );
  }
});

setTimeout(() => {
  console.log(
    "\nBrowser A inserts: Hello "
  );

  textA.insert(0, "Hello ");
}, 1000);

setTimeout(() => {
  console.log(
    "\nBrowser B inserts: DocFlow"
  );

  textB.insert(textB.length, "DocFlow");
}, 2000);

setTimeout(() => {
  console.log("\nFinal values:");
  console.log("Browser A:", textA.toString());
  console.log("Browser B:", textB.toString());

  providerA.destroy();
  providerB.destroy();
  documentA.destroy();
  documentB.destroy();
}, 3500);