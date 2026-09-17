import { apiRequest } from "./api";

const DOCUMENTS_ENDPOINT = "/documents";

export async function getTankDocuments(tankId) {
  return apiRequest(
    `${DOCUMENTS_ENDPOINT}/tank/${tankId}`
  );
}

export async function getDocument(documentId) {
  return apiRequest(
    `${DOCUMENTS_ENDPOINT}/${documentId}`
  );
}

export async function createDocument(tankId, documentData) {
  return apiRequest(
    `${DOCUMENTS_ENDPOINT}/tank/${tankId}`,
    {
      method: "POST",
      body: JSON.stringify(documentData)
    }
  );
}

export async function updateDocument(
  documentId,
  documentData
) {
  return apiRequest(
    `${DOCUMENTS_ENDPOINT}/${documentId}`,
    {
      method: "PUT",
      body: JSON.stringify(documentData)
    }
  );
}

export async function deleteDocument(documentId) {
  return apiRequest(
    `${DOCUMENTS_ENDPOINT}/${documentId}`,
    {
      method: "DELETE"
    }
  );
}