let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

let studyQueue = [];
let inStudy = false;
let currentIndex = 0;
let showingFront = true;
let correctCount = 0;
let studyTotal = 0;
let sessionCorrectCount = 0; 
let sessionWrongCount = 0;

let somAcerto = null;
let somErro = null;

const frontInput = document.getElementById("frontInput");
const backInput = document.getElementById("backInput");
const addBtn = document.getElementById("addFlashcard");
const list = document.getElementById("flashcardList");
const creationArea = document.getElementById("creationArea");

const flipBtn = document.getElementById("flipCard");
const nextBtn = document.getElementById("nextCard");
const correctBtn = document.getElementById("correctCard");
const wrongBtn = document.getElementById("wrongCard");
const backToCreate = document.getElementById("backToCreate");

const cardContent = document.getElementById("cardContent");
const cardSide = document.getElementById("cardSide");
const progress = document.getElementById("progress");

const FLIP_MS = 600;

function carregarSons() {
  somAcerto = new Audio("audio/correct.mp3");
  somAcerto.volume = 0.5;
  
  somErro = new Audio("audio/wrong.mp3");
  somErro.volume = 0.5;
}

function tocarSomAcerto() {
  if (somAcerto) {
    somAcerto.currentTime = 0;
    somAcerto.play().catch(() => tocarBeepAcerto());
  } else {
    tocarBeepAcerto();
  }
}

function tocarSomErro() {
  if (somErro) {
    somErro.currentTime = 0;
    somErro.play().catch(() => tocarBeepErro());
  } else {
    tocarBeepErro();
  }
}

function tocarBeepAcerto() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    console.log("Erro ao criar beep de acerto:", e);
  }
}

function tocarBeepErro() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.log("Erro ao criar beep de erro:", e);
  }
}

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

      window.mostrarNotificacao('Flashcard excluído', 'info');

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
  if (!front || !back) {
    window.mostrarNotificacao('Preencha frente e verso do flashcard!', 'aviso');
    return;
  }

  const newCard = { front, back };
  flashcards.push(newCard);
  saveFlashcards();
  renderList();
  frontInput.value = "";
  backInput.value = "";

  if (window.StudyStats) {
      window.StudyStats.recordFlashcardCreation(); 
  }

  window.mostrarNotificacao('Flashcard criado com sucesso! 📝', 'sucesso');

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
    if (frontEl) frontEl.textContent = inStudy ? "Nenhum flashcard disponível!" : '👆 Clique aqui para iniciar o estudo';
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

const studyArea = document.getElementById("studyArea");
if (studyArea) {
  studyArea.addEventListener("click", () => {
    if (!inStudy) {
      if (flashcards.length === 0) {
        window.mostrarNotificacao('Crie flashcards antes de estudar!', 'aviso');
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

      showCard();
      updateProgress();
      
      carregarSons();

      window.mostrarNotificacao('Modo de estudo ativado! 📚', 'info');
    }
  });

  studyArea.style.cursor = "pointer";
}

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

  tocarSomAcerto();

  const studyArea = document.getElementById("studyArea");
  if (!studyArea.classList.contains("flipped")) {
    studyArea.classList.add("flipped");
    showingFront = false;
    cardSide.textContent = "Verso";
    disableButtons(true);

    setTimeout(() => {
      studyArea.classList.remove("flipped");
      
      sessionCorrectCount++; 
      correctCount++;
      studyQueue.splice(currentIndex, 1);

      if (studyQueue.length === 0) {
        endStudy(true);
        disableButtons(false);
        return;
      }

      if (currentIndex >= studyQueue.length) currentIndex = 0;
      showingFront = true;
      showCard();
      updateProgress();
      disableButtons(false);
    }, 1500);
  } else {
    withFlipDelay(() => {

      sessionCorrectCount++; 
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
  }
});

wrongBtn.addEventListener("click", () => {
  if (!inStudy || studyQueue.length === 0) return;

  tocarSomErro();

  const studyArea = document.getElementById("studyArea");
  if (!studyArea.classList.contains("flipped")) {
    studyArea.classList.add("flipped");
    showingFront = false;
    cardSide.textContent = "Verso";
    disableButtons(true);

    setTimeout(() => {
      studyArea.classList.remove("flipped");
      
      sessionWrongCount++;

      const card = studyQueue.splice(currentIndex, 1)[0];
      studyQueue.push(card);

      if (currentIndex >= studyQueue.length) currentIndex = 0;
      showingFront = true;
      showCard();
      updateProgress();
      disableButtons(false);
    }, 1500);
  } else {
    withFlipDelay(() => {

      sessionWrongCount++;

      const card = studyQueue.splice(currentIndex, 1)[0];
      studyQueue.push(card);

      if (currentIndex >= studyQueue.length) currentIndex = 0;
      showingFront = true;
      showCard();
      updateProgress();
    });
  }
});

backToCreate.addEventListener("click", () => {
  if (!inStudy) return;

  endStudy(false, "Estudo interrompido para criar novos flashcards");

  window.mostrarNotificacao('Estudo reiniciado. Crie novos cards!', 'info');
});

function endStudy(finished = true, message = null) {

  if (finished && (sessionCorrectCount > 0 || sessionWrongCount > 0) && window.StudyStats) {
      window.StudyStats.recordFlashcardSessionEnd(sessionCorrectCount, sessionWrongCount);
  }

  sessionCorrectCount = 0;
  sessionWrongCount = 0;

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

  const frontEl = document.getElementById("cardFront");
  const backEl = document.getElementById("cardBack");
  const studyArea = document.getElementById("studyArea");
  
  if (finished) {
    if (frontEl) frontEl.textContent = "🎉 Parabéns! Você acertou todos os flashcards!";
    if (backEl) backEl.textContent = "";

    window.mostrarNotificacao('Parabéns! Estudo concluído! 🎉', 'sucesso');

    setTimeout(() => {
      if (frontEl) frontEl.textContent = "👆 Clique aqui para iniciar o estudo";
      correctCount = 0;
      updateProgress();
    }, 3000);
  } else {
    if (frontEl) frontEl.textContent = "👆 Clique aqui para iniciar o estudo";
    if (backEl) backEl.textContent = "";
    
    if (message) {
      window.mostrarNotificacao(message, 'info');
    }

    correctCount = 0;
  }

  if (studyArea) studyArea.classList.remove("flipped");
  
  cardSide.textContent = "-";
  updateProgress();
}


renderList();
updateProgress();
showCard();