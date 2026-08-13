const API_BASE_URL = "http://localhost:8080";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    }
  );

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Response wasn't JSON.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default apiRequest;