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

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.querySelector("#login-section");

  const registerSection = document.querySelector("#register-section");

  const dashboardSection = document.querySelector("#dashboard-section");

  if (isAuthenticated()) {
    dashboardSection.style.display = "block";
  } else {
    loginSection.style.display = "block";
  }
});

const registerForm = document.querySelector("#register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#register-name").value;

    const email = document.querySelector("#register-email").value;

    const password = document.querySelector("#register-password").value;

    const message = document.querySelector("#register-message");

    message.textContent = "Criando conta...";

    const result = await register(name, email, password);

    if (result.success) {
      message.textContent = "Conta criada com sucesso!";

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return;
    }

    message.textContent = result.message;
  });
}

const showRegisterButton = document.querySelector("#show-register-button");

const backLoginButton = document.querySelector("#back-login-button");

if (showRegisterButton) {
  showRegisterButton.addEventListener("click", () => {
    document.querySelector("#login-section").style.display = "none";

    document.querySelector("#register-section").style.display = "block";
  });
}

if (backLoginButton) {
  backLoginButton.addEventListener("click", () => {
    document.querySelector("#register-section").style.display = "none";

    document.querySelector("#login-section").style.display = "block";
  });
}
