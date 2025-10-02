document.addEventListener("DOMContentLoaded", function () {
  const darkToggle = document.getElementById("darkModeToggle");
  if (darkToggle) {
    const prefer = localStorage.getItem("darkMode");
    if (prefer === "true") {
      document.body.classList.add("dark-mode");
      darkToggle.textContent = "☀️";
    } else {
      darkToggle.textContent = "🌙";
    }

    darkToggle.addEventListener("click", () => {
      const enabled = document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", enabled ? "true" : "false");
      darkToggle.textContent = enabled ? "☀️" : "🌙";
    });
  }
});