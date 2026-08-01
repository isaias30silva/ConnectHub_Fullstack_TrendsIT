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
