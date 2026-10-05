const API_BASE_URL = "http://localhost:8080";

async function apiRequest(
  endpoint,
  options = {}
) {
  const token = localStorage.getItem("token");

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json"
        }),

    ...(options.headers || {})
  };

  // Add JWT to authenticated requests
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  // Token is missing/expired/invalid
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error("Your session has expired.");
  }

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
      // Response did not contain JSON.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  const text =
    await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

export default apiRequest;

export {
  apiRequest,
  API_BASE_URL
};