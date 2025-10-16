function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;

  let icone = '';
  switch(tipo) {
    case 'sucesso':
      icone = '✓';
      break;
    case 'info':
      icone = 'ℹ';
      break;
    case 'aviso':
      icone = '⚠';
      break;
    case 'erro':
      icone = '✕';
      break;
    default:
      icone = '✓';
  }

  toast.innerHTML = `
    <span class="toast-icon">${icone}</span>
    <span class="toast-message">${mensagem}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
}

window.mostrarNotificacao = mostrarNotificacao;