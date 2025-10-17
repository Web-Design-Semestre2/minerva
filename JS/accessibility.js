// ========================================
// ARQUIVO: JS/accessibility.js
// Melhorias de acessibilidade para o Minerva
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================
  // 1. MELHORAR MENU MOBILE COM TRAP DE FOCO
  // ==========================================
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  
  if (menuToggle && navMenu) {
    // Adicionar atributos ARIA
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'navMenu');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    
    // Função para prender o foco dentro do menu
    function trapFocus(element) {
      const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', function handleKeyDown(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        }
        
        // Fechar menu com ESC
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          closeMenu();
        }
      });
    }
    
    function closeMenu() {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      const overlay = document.querySelector('.menu-overlay');
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
      menuToggle.focus();
    }
    
    // Observar mudanças no menu
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          const isActive = navMenu.classList.contains('active');
          menuToggle.setAttribute('aria-expanded', isActive.toString());
          menuToggle.setAttribute('aria-label', isActive ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
          
          if (isActive) {
            trapFocus(navMenu);
            // Focar primeiro link do menu após pequeno delay
            setTimeout(() => {
              const firstLink = navMenu.querySelector('a');
              if (firstLink) firstLink.focus();
            }, 100);
          }
        }
      });
    });
    
    observer.observe(navMenu, { attributes: true });
  }
  
  // ==========================================
  // 2. MELHORAR FLASHCARDS - NAVEGAÇÃO TECLADO
  // ==========================================
  const studyArea = document.getElementById("studyArea");
  
  if (studyArea) {
    // Permitir ativação com Enter ou Espaço
    studyArea.addEventListener("keydown", function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        studyArea.click();
      }
    });
    
    // Adicionar feedback visual de foco
    studyArea.addEventListener('focus', function() {
      this.style.boxShadow = '0 0 0 3px var(--color-accent)';
    });
    
    studyArea.addEventListener('blur', function() {
      this.style.boxShadow = '';
    });
  }
  
  // ==========================================
  // 3. MELHORAR INPUTS - FEEDBACK DE ERRO
  // ==========================================
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
  
  inputs.forEach(input => {
    // Adicionar feedback visual quando vazio ao tentar submit
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.setAttribute('aria-invalid', 'true');
      this.style.borderColor = '#e74c3c';
    });
    
    input.addEventListener('input', function() {
      if (this.getAttribute('aria-invalid') === 'true') {
        this.removeAttribute('aria-invalid');
        this.style.borderColor = '';
      }
    });
  });
  
  // ==========================================
  // 4. MELHORAR BOTÕES - ESTADOS DESABILITADOS
  // ==========================================
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach(button => {
    // Observar mudanças no estado disabled
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'disabled') {
          const isDisabled = button.hasAttribute('disabled');
          button.setAttribute('aria-disabled', isDisabled.toString());
        }
      });
    });
    
    observer.observe(button, { attributes: true });
    
    // Setar estado inicial
    if (button.hasAttribute('disabled')) {
      button.setAttribute('aria-disabled', 'true');
    }
  });
  
  // ==========================================
  // 5. ANUNCIAR MUDANÇAS IMPORTANTES
  // ==========================================
  
  // Criar região de anúncio para screen readers
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
  }
  
  // Função global para anunciar mensagens
  window.announceToScreenReader = function(message) {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
  
  // ==========================================
  // 6. MELHORAR LISTAS - FEEDBACK DE ITENS
  // ==========================================
  
  // Para checklist
  const lista = document.getElementById('lista');
  if (lista) {
    lista.setAttribute('role', 'list');
    lista.setAttribute('aria-label', 'Lista de tarefas');

    const observer = new MutationObserver(function() {
      const items = lista.querySelectorAll('li');
      items.forEach((item, index) => {
        item.setAttribute('role', 'listitem');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          const span = item.querySelector('span');
          const id = `task-${index}`;
          checkbox.id = checkbox.id || id;
          checkbox.setAttribute('aria-labelledby', `${id}-label`);
          if (span) {
            span.id = `${id}-label`;
          }
        }
      });
    });
    
    observer.observe(lista, { childList: true, subtree: true });
  }
  
  // Para lista de flashcards
  const flashcardList = document.getElementById('flashcardList');
  if (flashcardList) {
    flashcardList.setAttribute('role', 'list');
    flashcardList.setAttribute('aria-label', 'Lista de flashcards criados');
  }

  document.addEventListener('keydown', function(e) {
    // Ctrl + K ou Cmd + K para focar na busca/input principal
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const mainInput = document.querySelector('input[type="text"]:not([disabled])');
      if (mainInput) mainInput.focus();
    }
  });
  
  console.log('✅ Melhorias de acessibilidade carregadas!');
});