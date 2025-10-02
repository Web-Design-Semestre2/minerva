// ================= MENU HAMBÚRGUER =================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const overlay = document.createElement("div");
overlay.className = "menu-overlay";
document.body.appendChild(overlay);

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");

    document.body.style.overflow = navMenu.classList.contains("active") 
      ? "hidden" 
      : "";
  });

  overlay.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  const menuLinks = navMenu.querySelectorAll(".menu a");
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

// ================= BOTÃO VOLTAR AO TOPO =================
const topoBtn = document.getElementById("topo");
if (topoBtn) {
  topoBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// ================= DARK MODE =================
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