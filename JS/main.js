const topoBtn = document.getElementById("topo");
if (topoBtn) {
  topoBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

const themeToggle = document.getElementById("darkModeToggle");

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-mode") {
    document.body.classList.add("dark-mode");
  }
});

if (themeToggle) {
  themeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark-mode");
    } else {
      localStorage.setItem("theme", "");
    }
  };
}
