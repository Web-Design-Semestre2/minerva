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

function parseTempo(input) {
    const partes = input.split(":");
    if (partes.length === 2) {
        const minutos = parseInt(partes[0], 10);
        const segundos = parseInt(partes[1], 10);
        if (!isNaN(minutos) && !isNaN(segundos)) {
            return minutos * 60 + segundos;
        }
    }
    return 0;
}

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${minutos}:${seg < 10 ? "0" : ""}${seg}`;
}

function atualizarDisplay() {
    display.textContent = formatarTempo(tempoAtual);
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
    if (!intervalo) {
        if (tempoAtual === 0 || tempoAtual === tempoEstudo || tempoAtual === tempoDescanso) {
            const novoEstudo = parseTempo(inputEstudo.value);
            const novoDescanso = parseTempo(inputDescanso.value);

            if (novoEstudo > 0 && novoDescanso > 0) {
                tempoEstudo = novoEstudo;
                tempoDescanso = novoDescanso;
                tempoAtual = emEstudo ? tempoEstudo : tempoDescanso;
            } else {
                alert("Digite o tempo no formato MM:SS");
                return;
            }
        }
        iniciarPomodoro();
    }
};

document.getElementById("pausar").onclick = () => {
    clearInterval(intervalo);
    intervalo = null;
};

document.getElementById("resetar").onclick = () => {
    clearInterval(intervalo);
    intervalo = null;
    emEstudo = true;

    const novoEstudo = parseTempo(inputEstudo.value);
    const novoDescanso = parseTempo(inputDescanso.value);

    tempoEstudo = novoEstudo > 0 ? novoEstudo : 25 * 60;
    tempoDescanso = novoDescanso > 0 ? novoDescanso : 5 * 60;
    tempoAtual = tempoEstudo;
    atualizarDisplay();
};

atualizarDisplay();
