function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function renderPost() {
  const slug = getSlug();
  const post = blogPosts.find(p => p.slug === slug);
  const container = document.getElementById("blogPostContent");

  if (!post) {
    container.innerHTML = `<h2>Post não encontrado</h2>
      <a href='blog.html' class="back-link">← Voltar ao Blog</a>`;
    document.title = "Minerva - Post não encontrado";
    return;
  }

  document.title = `Minerva - ${post.title}`;
  container.innerHTML = `
    <h1>${post.title}</h1>
    <p><em>${post.date}</em></p>
    ${post.content}
    <a href="blog.html" class="back-link">← Voltar ao Blog</a>
  `;
}

document.addEventListener("DOMContentLoaded", renderPost);