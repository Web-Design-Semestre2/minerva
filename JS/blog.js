document.addEventListener("DOMContentLoaded", function () {
  const postsContainer = document.getElementById("blogPosts");
  if (!postsContainer) return;

  if (!window.blogPosts || blogPosts.length === 0) {
    postsContainer.innerHTML = "<p>Nenhum post encontrado.</p>";
    return;
  }

  postsContainer.innerHTML = blogPosts.map(post => `
    <div class="post">
      <h3>${post.title}</h3>
      <p><em>${post.date || ""}</em></p>
      <p>${post.summary || ""}</p>
      <a href="post.html?slug=${encodeURIComponent(post.slug)}">Leia mais</a>
    </div>
  `).join("");
});