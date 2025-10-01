const input = document.getElementById("novaTarefa");
const btnAdd = document.getElementById("adicionar");
const lista = document.getElementById("lista");

btnAdd.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = input.value;

    checkbox.addEventListener("change", () => {
      span.classList.toggle("feito");
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    lista.appendChild(li);
    input.value = "";
  }
});
