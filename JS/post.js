function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function renderPost() {
  const slug = getSlug();
  const post = blogPosts.find(p => p.slug === slug);
  const container = document.getElementById("blogPostContent");

  if (!post) {
    container.innerHTML = "<h2>Post não encontrado</h2><a href='blog.html'>← Voltar ao Blog</a>";
    document.title = "Minerva - Post não encontrado";
    return;
  }

  document.title = `Minerva - ${post.title}`;
  container.innerHTML = `
    <h1>${post.title}</h1>
    <p><em>${post.date}</em></p>
    ${post.content}
    <p><a href="blog.html">← Voltar ao Blog</a></p>
  `;
}

document.addEventListener("DOMContentLoaded", renderPost);