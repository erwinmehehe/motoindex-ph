"use client";

export const GARAGE_DOCUMENT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const GARAGE_DOCUMENT_ATTACHMENT_ACCEPT_ATTR = "application/pdf,image/jpeg,image/png,image/webp";

const DB_NAME = "motoindex-garage-documents-v1";
const DB_VERSION = 1;
const STORE_NAME = "attachments";
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export type GarageDocumentAttachmentSummary = {
  documentId: string;
  name: string;
  type: string;
  size: number;
  updatedAt: string;
};

type GarageDocumentAttachmentRecord = GarageDocumentAttachmentSummary & {
  blob: Blob;
};

function openGarageDocumentDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("Document storage is not available in this browser."));
  }
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "documentId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open private document storage."));
  });
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Private document storage failed."));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Private document storage failed."));
    transaction.onabort = () => reject(transaction.error || new Error("Private document storage was cancelled."));
  });
}

function summary(record: GarageDocumentAttachmentRecord): GarageDocumentAttachmentSummary {
  return {
    documentId: record.documentId,
    name: record.name,
    type: record.type,
    size: record.size,
    updatedAt: record.updatedAt,
  };
}

export function formatGarageDocumentAttachmentBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function saveGarageDocumentAttachment(documentId: string, file: File) {
  if (!documentId) throw new Error("Document record is missing.");
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a PDF, JPG, PNG or WebP file.");
  }
  if (file.size <= 0) throw new Error("The selected file is empty.");
  if (file.size > GARAGE_DOCUMENT_ATTACHMENT_MAX_BYTES) {
    throw new Error("Keep each document file at 10 MB or smaller.");
  }

  const database = await openGarageDocumentDb();
  try {
    const record: GarageDocumentAttachmentRecord = {
      documentId,
      name: file.name.slice(0, 180) || "garage-document",
      type: file.type,
      size: file.size,
      updatedAt: new Date().toISOString(),
      blob: file,
    };
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(record);
    await transactionDone(transaction);
    return summary(record);
  } finally {
    database.close();
  }
}

export async function getGarageDocumentAttachment(documentId: string) {
  const database = await openGarageDocumentDb();
  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const record = await requestResult(transaction.objectStore(STORE_NAME).get(documentId)) as GarageDocumentAttachmentRecord | undefined;
    return record || null;
  } finally {
    database.close();
  }
}

export async function listGarageDocumentAttachments(documentIds: string[]) {
  if (!documentIds.length) return [] as GarageDocumentAttachmentSummary[];
  const wanted = new Set(documentIds);
  const database = await openGarageDocumentDb();
  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const records = await requestResult(transaction.objectStore(STORE_NAME).getAll()) as GarageDocumentAttachmentRecord[];
    return records.filter((record) => wanted.has(record.documentId)).map(summary);
  } finally {
    database.close();
  }
}

export async function deleteGarageDocumentAttachment(documentId: string) {
  const database = await openGarageDocumentDb();
  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(documentId);
    await transactionDone(transaction);
  } finally {
    database.close();
  }
}

export async function deleteGarageDocumentAttachments(documentIds: string[]) {
  if (!documentIds.length) return;
  const database = await openGarageDocumentDb();
  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    for (const documentId of documentIds) store.delete(documentId);
    await transactionDone(transaction);
  } finally {
    database.close();
  }
}

export async function pruneGarageDocumentAttachments(allowedDocumentIds: string[]) {
  const allowed = new Set(allowedDocumentIds);
  const database = await openGarageDocumentDb();
  try {
    const readTransaction = database.transaction(STORE_NAME, "readonly");
    const records = await requestResult(readTransaction.objectStore(STORE_NAME).getAll()) as GarageDocumentAttachmentRecord[];
    const staleIds = records.map((record) => record.documentId).filter((documentId) => !allowed.has(documentId));
    if (!staleIds.length) return;
    const writeTransaction = database.transaction(STORE_NAME, "readwrite");
    const store = writeTransaction.objectStore(STORE_NAME);
    for (const documentId of staleIds) store.delete(documentId);
    await transactionDone(writeTransaction);
  } finally {
    database.close();
  }
}
