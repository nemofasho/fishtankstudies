import apiRequest from "./api";

const TANKS_ENDPOINT = "/tanks";

export async function getTank(tankId) {
  return apiRequest(`${TANKS_ENDPOINT}/${tankId}`);
}

export async function getTanks() {
  return apiRequest("/tanks/my");
}

export async function createTank(tankData) {
  return apiRequest(TANKS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(tankData)
  });
}

export async function updateTank(tankId, tankData) {
  return apiRequest(`${TANKS_ENDPOINT}/${tankId}`, {
    method: "PUT",
    body: JSON.stringify(tankData)
  });
}

export async function deleteTank(tankId) {
  return apiRequest(`${TANKS_ENDPOINT}/${tankId}`, {
    method: "DELETE"
  });
}

export async function getAvailableTanks() {
  return apiRequest(TANKS_ENDPOINT);
}

export async function joinTank(tankId) {
  return apiRequest(`/tanks/${tankId}/join`, {
    method: "POST"
  });
}