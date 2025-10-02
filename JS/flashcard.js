let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

let studyQueue = [];
let inStudy = false;
let currentIndex = 0;
let showingFront = true;
let correctCount = 0;
let studyTotal = 0;

const frontInput = document.getElementById("frontInput");
const backInput = document.getElementById("backInput");
const addBtn = document.getElementById("addFlashcard");
const list = document.getElementById("flashcardList");
const creationArea = document.getElementById("creationArea");

const startBtn = document.getElementById("startStudy");
const flipBtn = document.getElementById("flipCard");
const nextBtn = document.getElementById("nextCard");
const correctBtn = document.getElementById("correctCard");
const wrongBtn = document.getElementById("wrongCard");
const backToCreate = document.getElementById("backToCreate");

const cardContent = document.getElementById("cardContent");
const cardSide = document.getElementById("cardSide");
const progress = document.getElementById("progress");

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

const FLIP_MS = 600;

function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function renderList() {
  list.innerHTML = "";
  flashcards.forEach((card, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${card.front} ➝ ${card.back}`;
    span.style.flex = "1";
    li.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.style.background = "red";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.padding = "6px 10px";
    delBtn.style.borderRadius = "6px";
    delBtn.style.cursor = "pointer";

    delBtn.onclick = () => {
      const removed = flashcards.splice(index, 1)[0];
      saveFlashcards();
      renderList();

      if (inStudy) {
        studyQueue = studyQueue.filter(
          c => !(c.front === removed.front && c.back === removed.back)
        );
        if (studyQueue.length === 0) {
          endStudy(false, "Após exclusão não há mais cards para estudar.");
        } else {
          if (currentIndex >= studyQueue.length) currentIndex = 0;
          updateProgress();
          showCard();
        }
      }
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const front = frontInput.value.trim();
  const back = backInput.value.trim();
  if (!front || !back) return alert("Preencha frente e verso!");

  const newCard = { front, back };
  flashcards.push(newCard);
  saveFlashcards();
  renderList();
  frontInput.value = "";
  backInput.value = "";

  if (inStudy) {
    studyQueue.push({ ...newCard });
    studyTotal++;
    updateProgress();
  }
});

function updateProgress() {
  progress.textContent = `Progresso: ${correctCount}/${studyTotal} — Restantes: ${studyQueue.length}`;
}

function showCard() {
  const frontEl = document.getElementById("cardFront");
  const backEl = document.getElementById("cardBack");
  const studyArea = document.getElementById("studyArea");

  if (!inStudy || studyQueue.length === 0) {
    if (frontEl) frontEl.textContent = inStudy ? "Nenhum flashcard disponível!" : 'Clique em "Iniciar Estudo"';
    if (backEl) backEl.textContent = "";
    cardSide.textContent = "-";
    if (studyArea) studyArea.classList.remove("flipped");
    return;
  }

  const card = studyQueue[currentIndex];
  if (frontEl) frontEl.textContent = card.front;
  if (backEl) backEl.textContent = card.back;

  if (studyArea) studyArea.classList.remove("flipped");
  showingFront = true;
  cardSide.textContent = "Frente";
}

startBtn.addEventListener("click", () => {
  if (flashcards.length === 0) {
    alert("Nenhum flashcard criado!");
    return;
  }

  studyQueue = flashcards.map(c => ({ ...c }));
  inStudy = true;
  currentIndex = 0;
  showingFront = true;
  correctCount = 0;
  studyTotal = studyQueue.length;

  creationArea.style.display = "none";

  flipBtn.disabled = false;
  nextBtn.disabled = false;
  correctBtn.disabled = false;
  wrongBtn.disabled = false;
  backToCreate.disabled = false;
  startBtn.disabled = true;

  showCard();
  updateProgress();
});

flipBtn.addEventListener("click", () => {
  if (!inStudy || studyQueue.length === 0) return;
  const studyArea = document.getElementById("studyArea");
  const isFlipped = studyArea.classList.toggle("flipped");
  showingFront = !showingFront;
  cardSide.textContent = showingFront ? "Frente" : "Verso";
});

nextBtn.addEventListener("click", () => {
  if (!inStudy || studyQueue.length === 0) return;
  currentIndex = (currentIndex + 1) % studyQueue.length;
  showingFront = true;
  showCard();
});

function disableButtons(disabled) {
  flipBtn.disabled = disabled;
  nextBtn.disabled = disabled;
  correctBtn.disabled = disabled;
  wrongBtn.disabled = disabled;
  backToCreate.disabled = disabled;
}

function withFlipDelay(callback) {
  const studyArea = document.getElementById("studyArea");
  const wasFlipped = studyArea.classList.contains("flipped");

  if (wasFlipped) {
    studyArea.classList.remove("flipped");
    showingFront = true;
    cardSide.textContent = "Frente";
    disableButtons(true);

    setTimeout(() => {
      try { callback(); } finally { disableButtons(false); }
    }, FLIP_MS + 80);
  } else {
    disableButtons(true);
    setTimeout(() => {
      try { callback(); } finally { disableButtons(false); }
    }, 120);
  }
}

correctBtn.addEventListener("click", () => {
  if (!inStudy || studyQueue.length === 0) return;

  withFlipDelay(() => {
    correctCount++;
    studyQueue.splice(currentIndex, 1);

    if (studyQueue.length === 0) {
      endStudy(true);
      return;
    }

    if (currentIndex >= studyQueue.length) currentIndex = 0;
    showingFront = true;
    showCard();
    updateProgress();
  });
});

wrongBtn.addEventListener("click", () => {
  if (!inStudy || studyQueue.length === 0) return;

  withFlipDelay(() => {
    const card = studyQueue.splice(currentIndex, 1)[0];
    studyQueue.push(card);

    if (currentIndex >= studyQueue.length) currentIndex = 0;
    showingFront = true;
    showCard();
    updateProgress();
  });
});

backToCreate.addEventListener("click", () => {
  if (!inStudy) return;
  creationArea.style.display = creationArea.style.display === "none" ? "" : "none";
});

function endStudy(finished = true, message = null) {
  inStudy = false;
  studyQueue = [];
  currentIndex = 0;
  showingFront = true;

  creationArea.style.display = "";

  flipBtn.disabled = true;
  nextBtn.disabled = true;
  correctBtn.disabled = true;
  wrongBtn.disabled = true;
  backToCreate.disabled = true;
  startBtn.disabled = false; // reabilita start

  const frontEl = document.getElementById("cardFront");
  const backEl = document.getElementById("cardBack");
  if (finished) {
    if (frontEl) frontEl.textContent = "🎉 Parabéns! Você acertou todos os flashcards!";
    if (backEl) backEl.textContent = "";
  } else {
    if (frontEl) frontEl.textContent = message || "Estudo finalizado.";
    if (backEl) backEl.textContent = "";
  }

  cardSide.textContent = "-";
  updateProgress();
}

renderList();
updateProgress();
