async function loadCurrentUser() {
  try {
    const user = await apiRequest("/users/me");

    const userName = document.querySelector("#user-name");
    const userEmail = document.querySelector("#user-email");

    if (userName) {
      userName.textContent = user.name;
    }

    if (userEmail) {
      userEmail.textContent = user.email;
    }

    return user;
  } catch (error) {
    console.error("Erro ao carregar usuário:", error);

    return null;
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
