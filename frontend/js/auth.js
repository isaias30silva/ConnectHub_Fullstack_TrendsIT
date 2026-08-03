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

async function validateToken() {
  try {
    await apiRequest("/users/me");

    return true;
  } catch (error) {
    return false;
  }
}
