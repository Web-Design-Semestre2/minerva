let tempoEstudo = 25 * 60;
let tempoDescanso = 5 * 60;
let tempoAtual = tempoEstudo;
let emEstudo = true;
let intervalo;

const display = document.getElementById("tempo");
const inputEstudo = document.getElementById("tempoEstudo");
const inputDescanso = document.getElementById("tempoDescanso");

const statusPomodoro = document.createElement("p");
statusPomodoro.id = "status";
statusPomodoro.textContent = "Tempo de Estudo";
display.insertAdjacentElement("beforebegin", statusPomodoro);

function atualizarDisplay() {
  let minutos = Math.floor(tempoAtual / 60);
  let segundos = tempoAtual % 60;
  display.textContent = `${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;
  statusPomodoro.textContent = emEstudo ? "Tempo de Estudo" : "Tempo de Descanso";
}

function iniciarPomodoro() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      tempoAtual--;
      atualizarDisplay();

      if (tempoAtual <= 0) {
        emEstudo = !emEstudo;
        tempoAtual = emEstudo ? tempoEstudo : tempoDescanso;
        atualizarDisplay();
      }
    }, 1000);
  }
}

document.getElementById("iniciar").onclick = () => {
  tempoEstudo = parseInt(inputEstudo.value) * 60;
  tempoDescanso = parseInt(inputDescanso.value) * 60;
  tempoAtual = emEstudo ? tempoEstudo : tempoDescanso;
  atualizarDisplay();
  iniciarPomodoro();
};

document.getElementById("pausar").onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
};

document.getElementById("resetar").onclick = () => {
  clearInterval(intervalo);
  intervalo = null;
  emEstudo = true;
  tempoEstudo = parseInt(inputEstudo.value) * 60;
  tempoDescanso = parseInt(inputDescanso.value) * 60;
  tempoAtual = tempoEstudo;
  atualizarDisplay();
};

atualizarDisplay();
