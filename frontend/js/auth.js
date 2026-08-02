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

async function register(name, email, password) {
  try {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    return {
      success: true,
      data: response,
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

function validateName(name) {
  if (name.trim() === "") {
    return "O nome é obrigatório.";
  }

  if (name.trim().length < 3) {
    return "O nome deve possuir pelo menos 3 caracteres.";
  }

  return null;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Informe um e-mail válido.";
  }

  return null;
}

function validatePassword(password) {
  if (password.length < 6) {
    return "A senha deve possuir pelo menos 6 caracteres.";
  }

  return null;
}

function showMessage(element, message, type) {
  element.textContent = message;

  element.style.display = "block";

  element.classList.remove("message-success", "message-error");

  element.classList.add(
    type === "success" ? "message-success" : "message-error",
  );
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#login-email").value;

    const password = document.querySelector("#login-password").value;

    const loginMessage = document.querySelector("#login-message");

    showMessage(loginMessage, "Autenticando...", "success");

    const result = await login(email, password);

    if (result.success) {
      showMessage(loginMessage, "Login realizado com sucesso!", "success");

      window.location.reload();

      return;
    }

    showMessage(loginMessage, result.message, "error");
  });
}

const logoutButton = document.querySelector("#logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginSection = document.querySelector("#login-section");

  const registerSection = document.querySelector("#register-section");

  const dashboardSection = document.querySelector("#dashboard-section");

  const token = localStorage.getItem("token");

  if (!token) {
    loginSection.style.display = "block";
    return;
  }

  const tokenIsValid = await validateToken();

  if (tokenIsValid) {
    dashboardSection.style.display = "block";

    const user = await getCurrentUser();

    if (user) {
      document.querySelector("#user-name").textContent = `Olá, ${user.name}!`;

      document.querySelector("#user-email").textContent = user.email;
    }

    await initializeApplication();
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

    const nameError = validateName(name);

    if (nameError) {
      showMessage(message, nameError, "error");
      return;
    }

    const emailError = validateEmail(email);

    if (emailError) {
      showMessage(message, emailError, "error");
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      showMessage(message, passwordError, "error");
      return;
    }

    showMessage(message, "Criando conta...", "success");

    const result = await register(name, email, password);

    if (result.success) {
      showMessage(message, "Conta criada com sucesso!", "success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return;
    }

    showMessage(message, result.message, "error");
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

async function validateToken() {
  try {
    await apiRequest("/users/me");

    return true;
  } catch (error) {
    console.error("Token inválido:", error);

    localStorage.removeItem("token");

    return false;
  }
}

async function getCurrentUser() {
  try {
    return await apiRequest("/users/me");
  } catch (error) {
    console.error(error);

    return null;
  }
}
