const API_URL = "https://connecthub-backend-gdgo.onrender.com/api";

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

  if (response.status === 401 && endpoint !== "/auth/login") {
    localStorage.removeItem("token");

    window.location.reload();

    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data;
}
