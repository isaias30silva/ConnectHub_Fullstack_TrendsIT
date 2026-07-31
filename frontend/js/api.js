const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data;
}
