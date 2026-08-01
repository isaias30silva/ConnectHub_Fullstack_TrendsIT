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

const loginForm = document.querySelector("#login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#login-email").value;

    const password = document.querySelector("#login-password").value;

    const loginMessage = document.querySelector("#login-message");

    loginMessage.textContent = "Autenticando...";

    const result = await login(email, password);

    if (result.success) {
      loginMessage.textContent = "Login realizado com sucesso!";

      window.location.reload();

      return;
    }

    loginMessage.textContent = result.message;
  });
}

const logoutButton = document.querySelector("#logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
