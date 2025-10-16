const STORAGE_KEY = 'minerva_study_stats';

// Inicializa o objeto de estatísticas com valores padrão
function getStats() {
    const defaultStats = {
        totalTimeSeconds: 0, // Agora rastrea em segundos para maior precisão
        pomodoroSessions: 0,
        tasksCompleted: 0,
        flashcardSessionsCompleted: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        recentActivity: [] 
    };
    
    const savedStats = localStorage.getItem(STORAGE_KEY);
    const stats = savedStats ? JSON.parse(savedStats) : defaultStats;
    
    // Migração de dados: Se existia totalTimeMinutes do formato antigo, converte para totalTimeSeconds
    if (stats.totalTimeMinutes !== undefined) {
        stats.totalTimeSeconds = stats.totalTimeMinutes * 60;
        delete stats.totalTimeMinutes;
        saveStats(stats);
    }
    // Garante que o campo exista
    if (stats.totalTimeSeconds === undefined) stats.totalTimeSeconds = 0;
    
    if (stats.flashcardSessionsCompleted === undefined) stats.flashcardSessionsCompleted = 0;

    return stats;
}

// Salva o objeto de estatísticas
function saveStats(stats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

// =================================================================
// FUNÇÕES DE REGISTRO
// =================================================================

// 1. Pomodoro - Aceita duração em SEGUNDOS
function recordPomodoroSession(durationSeconds) {
    const stats = getStats();
    stats.totalTimeSeconds += durationSeconds;
    stats.pomodoroSessions++;
    
    stats.recentActivity.unshift({
        type: 'pomodoro',
        date: Date.now(),
        details: `Sessão Pomodoro concluída.`,
        duration: durationSeconds // Armazena a duração exata
    });
    
    stats.recentActivity = stats.recentActivity.slice(0, 10);
    saveStats(stats);
    if (document.getElementById('totalTimeValue')) {
        renderStats();
    }
}

function recordFlashcardSessionEnd(correctCount, wrongCount) {
    const stats = getStats();
    stats.correctAnswers += correctCount;
    stats.wrongAnswers += wrongCount;

    stats.flashcardSessionsCompleted++;
    
    // Registra a sessão agrupada
    stats.recentActivity.unshift({
        type: 'flashcard_session',
        date: Date.now(),
        correct: correctCount,
        wrong: wrongCount
    });
    
    stats.recentActivity = stats.recentActivity.slice(0, 10);
    saveStats(stats);
    if (document.getElementById('correctAnswersValue')) {
        renderStats();
    }
}

// 3. Checklist
function recordTaskCompletion() {
    const stats = getStats();
    stats.tasksCompleted++;
    stats.recentActivity.unshift({
        type: 'task',
        date: Date.now(),
        details: 'Tarefa marcada como concluída.'
    });
    stats.recentActivity = stats.recentActivity.slice(0, 10);
    saveStats(stats);
    if (document.getElementById('tasksCompletedValue')) {
        renderStats();
    }
}


// =================================================================
// FUNÇÕES DE FORMATAÇÃO E RENDERIZAÇÃO
// =================================================================

function formatDuration(totalSeconds) {
    if (totalSeconds === 0) {
        return "0 minutos";
    }

    if (totalSeconds < 60) {
        return `${totalSeconds} segundos`; 
    }
    
    const totalMinutes = Math.round(totalSeconds / 60);
    
    if (totalMinutes < 60) {
        if (totalMinutes === 1) {
            return `${totalMinutes} minuto`;
        }
        return `${totalMinutes} minutos`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    let result = '';
    if (hours > 0) {
        result += `${hours}h`;
        if (minutes > 0) {
            result += ` e ${minutes} min`;
        }
    } else {
        result = `${minutes} minutos`;
    }
    return result.trim();
}

// Formatação para o histórico (MM:SS)
function formatTimeMinSec(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // Garante dois dígitos
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderStats() {
    const stats = getStats();
    
    // 1. Tempo Total de Estudo (Usando totalTimeSeconds)
    const totalTimeValue = document.getElementById('totalTimeValue');
    if (totalTimeValue) {
        totalTimeValue.textContent = formatDuration(stats.totalTimeSeconds);
    }

    // 2. Outras Métricas Chave
    document.getElementById('pomodoroCountValue').textContent = stats.pomodoroSessions.toLocaleString('pt-BR');
    document.getElementById('tasksCompletedValue').textContent = stats.tasksCompleted.toLocaleString('pt-BR');
    document.getElementById('flashcardsCreatedValue').textContent = stats.flashcardsCreated.toLocaleString('pt-BR');
    
    const flashcardsSessionsValue = document.getElementById('flashcardsSessionsValue');
    if (flashcardsSessionsValue) {
        flashcardsSessionsValue.textContent = stats.flashcardSessionsCompleted.toLocaleString('pt-BR');
    }

    // 3. Performance em Flashcards
    const totalAnswers = stats.correctAnswers + stats.wrongAnswers;
    const hitRate = totalAnswers > 0 
        ? ((stats.correctAnswers / totalAnswers) * 100).toFixed(1) 
        : 0;

    document.getElementById('correctAnswersValue').textContent = stats.correctAnswers.toLocaleString('pt-BR');
    document.getElementById('wrongAnswersValue').textContent = stats.wrongAnswers.toLocaleString('pt-BR');
    document.getElementById('hitRateValue').textContent = `${hitRate}%`;
    
    // 4. Histórico Recente
    const activityList = document.getElementById('recentActivityList');
    if (activityList) {
        activityList.innerHTML = '';
        if (stats.recentActivity.length === 0) {
            activityList.innerHTML = '<li class="activity-item">Nenhuma atividade recente registrada.</li>';
        } else {
            stats.recentActivity.forEach(activity => {
                const li = document.createElement('li');
                li.className = 'activity-item';
                let activityDescription = activity.details;

                if (activity.type === 'pomodoro') {
                    // Pomodoro: mostra minutos e segundos
                    const time = formatTimeMinSec(activity.duration || 0);
                    activityDescription = `Sessão Pomodoro concluída: ${time}`;
                } else if (activity.type === 'flashcard_session') {
                    // Flashcard Session: mostra acertos e erros agrupados
                    activityDescription = `Sessão Flashcard: ${activity.correct} acertos, ${activity.wrong} erros.`;
                }
                
                li.textContent = `${formatDate(activity.date)}: ${activityDescription}`;
                activityList.appendChild(li);
            });
        }
    }
}

// =================================================================
// FUNÇÃO DE RESET E EXPOSIÇÃO GLOBAL
// =================================================================

function resetAllStats() {
    if (confirm("ATENÇÃO: Você tem certeza que deseja resetar todas as suas estatísticas de estudo? Esta ação não pode ser desfeita.")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload(); 
    }
}

// Expõe as funções de registro globalmente
window.StudyStats = {
    recordPomodoroSession,
    recordTaskCompletion,
    recordFlashcardCreation,
    recordFlashcardSessionEnd 
};

// Carrega os dados na página de estatísticas quando ela é aberta
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('totalTimeValue')) {
        renderStats();
    }
    const resetBtn = document.getElementById('resetStatsBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllStats);
    }
});