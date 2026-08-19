import * as Y from "yjs";

const documentA = new Y.Doc();
const documentB = new Y.Doc();

const textA = documentA.getText("content");
const textB = documentB.getText("content");

console.log("Before synchronization:");
console.log("Browser A:", textA.toString());
console.log("Browser B:", textB.toString());

textA.insert(0, "Hello ");
textB.insert(0, "DocFlow");

console.log("Before synchronization:");
console.log("Browser A:", textA.toString());
console.log("Browser B:", textB.toString());

const updateFromA =
  Y.encodeStateAsUpdate(documentA);

const updateFromB =
  Y.encodeStateAsUpdate(documentB);

Y.applyUpdate(documentA, updateFromB);
Y.applyUpdate(documentB, updateFromA);

console.log("\nAfter synchronization:");
console.log("Browser A:", textA.toString());
console.log("Browser B:", textB.toString());