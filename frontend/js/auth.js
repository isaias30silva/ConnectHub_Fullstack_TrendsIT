async function login(email, password) {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem("token", response.token);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

function logout() {
  localStorage.removeItem("token");

  window.location.reload();
}

function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
