const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401) {
    localStorage.removeItem("token");

    window.location.reload();

    throw new Error("Sessão expirada.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data;
}
