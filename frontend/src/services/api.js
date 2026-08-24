const API_BASE_URL = "http://localhost:8080";

async function apiRequest(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  // Handle errors
  if (!response.ok) {
    let errorMessage =
      `Request failed with status ${response.status}`;

    try {
      const errorData =
        await response.json();

      errorMessage =
        errorData.message ||
        errorMessage;
    } catch {
      // Response did not contain JSON
    }

    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Read response as text first
  const text = await response.text();

  // Some successful endpoints return no body
  if (!text) {
    return null;
  }

  // Parse JSON responses
  return JSON.parse(text);
}

export default apiRequest;
export { apiRequest };