const SEOManager = {
    pages: {
        'index.html': {
            title: 'Minerva - Plataforma de Estudos Inteligente',
            description: 'Minerva é sua plataforma de estudos completa com Pomodoro, Flashcards, Checklist e Blog educativo. Aprenda de forma estratégica e eficiente!',
            keywords: 'estudos, plataforma educacional, pomodoro, flashcards, técnicas de estudo, organização'
        },
        'blog.html': {
            title: 'Blog Minerva - Dicas e Métodos de Estudo',
            description: 'Artigos sobre técnicas de estudo, produtividade, gamificação e preparação para vestibular. Aprenda a estudar melhor!',
            keywords: 'blog de estudos, técnicas de estudo, produtividade, métodos de aprendizagem'
        },
        'ferramentas.html': {
            title: 'Ferramentas de Estudo - Pomodoro e Checklist | Minerva',
            description: 'Organize seus estudos com Timer Pomodoro e Checklist de tarefas. Ferramentas práticas para aumentar sua produtividade.',
            keywords: 'pomodoro, checklist, ferramentas de estudo, produtividade, gestão de tempo'
        },
        'flashcards.html': {
            title: 'Flashcards - Sistema de Memorização | Minerva',
            description: 'Crie e estude com flashcards personalizados. Sistema de repetição espaçada para fixar conteúdos de forma eficiente.',
            keywords: 'flashcards, memorização, repetição espaçada, estudo ativo'
        },
        'contato.html': {
            title: 'Contato - Minerva',
            description: 'Entre em contato com a equipe Minerva. Envie suas dúvidas, sugestões e feedback.',
            keywords: 'contato, suporte, feedback'
        }
    },

    init() {
        this.setMetaTags();
        this.addStructuredData();
        this.improveAccessibility();
    },

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return page;
    },

    setMetaTags() {
        const currentPage = this.getCurrentPage();
        const pageData = this.pages[currentPage] || this.pages['index.html'];

        document.title = pageData.title;

        this.createOrUpdateMeta('description', pageData.description);

        this.createOrUpdateMeta('keywords', pageData.keywords);

        this.createOrUpdateMeta('og:title', pageData.title, 'property');
        this.createOrUpdateMeta('og:description', pageData.description, 'property');
        this.createOrUpdateMeta('og:type', 'website', 'property');
        this.createOrUpdateMeta('og:url', window.location.href, 'property');
        this.createOrUpdateMeta('og:site_name', 'Minerva', 'property');

        this.createOrUpdateMeta('twitter:card', 'summary_large_image', 'name');
        this.createOrUpdateMeta('twitter:title', pageData.title, 'name');
        this.createOrUpdateMeta('twitter:description', pageData.description, 'name');


        this.createOrUpdateMeta('theme-color', '#2386A6', 'name');
        this.createOrUpdateMeta('apple-mobile-web-app-capable', 'yes', 'name');
        this.createOrUpdateMeta('apple-mobile-web-app-status-bar-style', 'default', 'name');

        this.createOrUpdateMeta('robots', 'index, follow', 'name');
    },

    createOrUpdateMeta(key, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${key}"]`);

        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, key);
            document.head.appendChild(meta);
        }

        meta.setAttribute('content', content);
    },

  addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Minerva",
            "description": "Plataforma de estudos inteligente com ferramentas de produtividade",
            "url": window.location.origin,
            "logo": window.location.origin + "/imagens/logo.png",
            "sameAs": [
                // Adicionar redes sociais aqui
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
    },

    improveAccessibility() {
        this.addSkipLink();

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        this.addMissingAriaLabels();
    },

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--color-accent);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
    `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
            main.setAttribute('role', 'main');
        }
    },

    addMissingAriaLabels() {
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (button.id === 'iniciar') button.setAttribute('aria-label', 'Iniciar timer Pomodoro');
            if (button.id === 'pausar') button.setAttribute('aria-label', 'Pausar timer');
            if (button.id === 'resetar') button.setAttribute('aria-label', 'Resetar timer');
            if (button.id === 'adicionar') button.setAttribute('aria-label', 'Adicionar tarefa à checklist');
            if (button.id === 'addFlashcard') button.setAttribute('aria-label', 'Adicionar novo flashcard');
            if (button.id === 'flipCard') button.setAttribute('aria-label', 'Virar flashcard');
            if (button.id === 'nextCard') button.setAttribute('aria-label', 'Próximo flashcard');
            if (button.id === 'correctCard') button.setAttribute('aria-label', 'Marcar como correto');
            if (button.id === 'wrongCard') button.setAttribute('aria-label', 'Marcar como errado');
        });

        const inputs = document.querySelectorAll('input:not([aria-label])');
        inputs.forEach(input => {
            if (input.id === 'novaTarefa' && !document.querySelector('label[for="novaTarefa"]')) {
                input.setAttribute('aria-label', 'Digite nova tarefa');
            }
            if (input.id === 'frontInput') input.setAttribute('aria-label', 'Frente do flashcard');
            if (input.id === 'backInput') input.setAttribute('aria-label', 'Verso do flashcard');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SEOManager.init();
});

const style = document.createElement('style');
style.textContent = `
  body.keyboard-navigation *:focus {
    outline: 3px solid var(--color-accent) !important;
    outline-offset: 2px !important;
  }
  
  .skip-link {
    transition: top 0.2s;
  }
  
  .skip-link:focus {
    outline: 3px solid white;
  }
`;
document.head.appendChild(style);