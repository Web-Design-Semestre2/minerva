let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const input = document.getElementById("novaTarefa");
const btnAdd = document.getElementById("adicionar");
const lista = document.getElementById("lista");

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizarLista() {
  lista.innerHTML = "";
  
  tarefas.forEach((tarefa, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;

    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    if (tarefa.concluida) {
      span.classList.add("feito");
    }

    checkbox.addEventListener("change", () => {
      tarefas[index].concluida = checkbox.checked;
      span.classList.toggle("feito");
      salvarTarefas();

      if (checkbox.checked) {
        window.mostrarNotificacao('Tarefa concluída! 🎉', 'sucesso');
      } else {
        window.mostrarNotificacao('Tarefa desmarcada', 'info');
      }
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "×";
    btnExcluir.className = "btn-excluir";
    btnExcluir.style.background = "#e74c3c";
    btnExcluir.style.color = "white";
    btnExcluir.style.border = "none";
    btnExcluir.style.padding = "6px 12px";
    btnExcluir.style.borderRadius = "6px";
    btnExcluir.style.cursor = "pointer";
    btnExcluir.style.marginLeft = "auto";
    btnExcluir.style.fontSize = "1.2rem";
    btnExcluir.style.fontWeight = "bold";

    btnExcluir.addEventListener("click", () => {
      tarefas.splice(index, 1);
      salvarTarefas();
      renderizarLista();

      window.mostrarNotificacao('Tarefa excluída', 'info');
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnExcluir);
    lista.appendChild(li);
  });
}

function adicionarTarefa() {
  if (input.value.trim() !== "") {
    const novaTarefa = {
      texto: input.value.trim(),
      concluida: false
    };
    
    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarLista();
    input.value = "";
    input.focus();

    window.mostrarNotificacao('Tarefa adicionada com sucesso! ✓', 'sucesso');
  }
}

btnAdd.addEventListener("click", adicionarTarefa);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); 
    adicionarTarefa();
  }
});

renderizarLista();