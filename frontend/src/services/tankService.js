const API_URL = "http://localhost:8080/tanks";

export async function getAllTanks() {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load Tanks");
  }

  return await response.json();
}


export async function createTank(tankData) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(tankData)
  });

  if (!response.ok) {
    throw new Error("Failed to create Tank");
  }

  return await response.json();
}