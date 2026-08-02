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
