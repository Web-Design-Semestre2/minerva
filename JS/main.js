document.getElementById("topo").onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById("darkModeToggle").onclick = () => {
    document.body.classList.toggle("dark-mode");
};
