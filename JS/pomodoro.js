let tempoEstudo = 25 * 60;
let tempoDescanso = 5 * 60;
let tempoAtual = tempoEstudo;
let emEstudo = true;
let intervalo;

// Sistema de música
let audioAtual = null;
let notificacaoAudio = null;

const musicas = {
    none: { nome: "Sem música", url: null },
    lofi: { 
        nome: "🎹 Calm Piano", 
        url: "audio/calm-piano.mp3" 
    },
    lofi2: { 
        nome: "🎧 Lo-fi Chill Hop", 
        url: "audio/lofi-chill-hop.mp3" 
    },
    lofi3: { 
        nome: "🌿 Lo-fi with Nature", 
        url: "audio/lofi-sounds-of-nature.mp3" 
    },
    lofi4: { 
        nome: "📼 Nostalgic 90s Lofi", 
        url: "audio/nostalgic-90s-lofi.mp3" 
    }
};

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

// Beep de backup caso o arquivo de som não exista
function tocarBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        console.log("🔊 Beep tocado!");
    } catch (e) {
        console.log("❌ Erro ao criar beep:", e);
    }
}

// Som de notificação quando trocar o período
function tocarNotificacao() {
    console.log("🔔 NOTIFICAÇÃO ATIVADA!");
    console.log("Estado atual:", emEstudo ? "Estudo" : "Descanso");
    
    // Toca beep sempre (garantido)
    tocarBeep();
    
    // Tenta tocar som personalizado
    try {
        const notificacaoAudio = new Audio("audio/notification.mp3");
        notificacaoAudio.volume = 0.5;
        notificacaoAudio.play()
            .then(() => console.log("✅ Som personalizado tocado!"))
            .catch(err => console.log("⚠️ Arquivo notification.mp3 não encontrado:", err.message));
    } catch (e) {
        console.log("❌ Erro ao criar áudio:", e.message);
    }
    
    // Notificação visual do navegador
    if ("Notification" in window && Notification.permission === "granted") {
        const mensagem = emEstudo ? "📚 Hora de estudar!" : "⏰ Hora do descanso!";
        new Notification("Pomodoro - Minerva", {
            body: mensagem,
            icon: "https://via.placeholder.com/128/2386A6/ffffff?text=M"
        });
    }
}

function iniciarPomodoro() {
    if (!intervalo) {
        intervalo = setInterval(() => {
            if (tempoAtual > 0) {
                tempoAtual--;
                atualizarDisplay();
            } else {
                // Quando chegar a zero
                console.log("⏰ Timer zerou!");
                clearInterval(intervalo);
                intervalo = null;
                
                // Toca o alarme
                tocarNotificacao();
                
                // Troca o período (estudo <-> descanso)
                emEstudo = !emEstudo;
                tempoAtual = emEstudo ? tempoEstudo : tempoDescanso;
                atualizarDisplay();
                
                console.log("🔄 Próximo período:", emEstudo ? "Estudo" : "Descanso");
                
                // Reinicia automaticamente após 2 segundos
                setTimeout(() => {
                    console.log("▶️ Reiniciando timer...");
                    iniciarPomodoro();
                }, 2000);
            }
        }, 1000);
    }
}

// Funções de controle de música
function trocarMusica(musicaId) {
    if (audioAtual) {
        audioAtual.pause();
        audioAtual.currentTime = 0;
        audioAtual = null;
    }

    if (musicaId !== 'none' && musicas[musicaId].url) {
        audioAtual = new Audio();
        audioAtual.src = musicas[musicaId].url;
        
        audioAtual.addEventListener('error', function() {
            console.warn('Erro ao carregar áudio MP3');
        });
        
        audioAtual.loop = true;
        audioAtual.volume = 0.3;
        
        audioAtual.play().catch(err => {
            console.log("Erro ao tocar música:", err);
            alert("Não foi possível reproduzir o áudio. Verifique se o arquivo existe.");
        });
    }

    document.querySelectorAll('.music-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btnAtivo = document.querySelector(`[data-music="${musicaId}"]`);
    if (btnAtivo) {
        btnAtivo.classList.add('active');
    }
}

function ajustarVolume(valor) {
    if (audioAtual) {
        audioAtual.volume = valor / 100;
    }
}

document.getElementById("iniciar").onclick = () => {
    if (!intervalo) {
        // Pede permissão para notificações (apenas primeira vez)
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        
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
        console.log("▶️ Timer iniciado!");
        iniciarPomodoro();
    }
};

document.getElementById("pausar").onclick = () => {
    clearInterval(intervalo);
    intervalo = null;
    console.log("⏸️ Timer pausado!");
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
    console.log("🔄 Timer resetado!");
};

// Event listeners para controles de música
document.querySelectorAll('.music-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const musicaId = btn.getAttribute('data-music');
        trocarMusica(musicaId);
    });
});

const volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        ajustarVolume(e.target.value);
    });
}

atualizarDisplay();
console.log("✅ Pomodoro carregado com sucesso!");