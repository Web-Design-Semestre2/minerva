document.addEventListener("DOMContentLoaded", function () {
  const darkToggle = document.getElementById("darkModeToggle");
  
  if (!darkToggle) return;

  const isDarkMode = localStorage.getItem("darkMode") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    darkToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    darkToggle.textContent = "🌙"; 
  }

  darkToggle.addEventListener("click", () => {
    const isNowDark = document.body.classList.toggle("dark-mode");

    darkToggle.textContent = isNowDark ? "☀️" : "🌙";

    localStorage.setItem("darkMode", isNowDark ? "true" : "false");
  });
});