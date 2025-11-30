// Interactive behaviors for the portfolio
document.addEventListener('DOMContentLoaded', () => {
    // --- Active nav highlighting ---
    const setActiveNav = () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(a => {
            const href = (a.getAttribute('href') || '').split('/').pop();
            if (href === path) a.classList.add('active'); else a.classList.remove('active');
        });
    };
    setActiveNav();

    // --- Theme toggle (persisted) ---
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    const applyTheme = (t) => {
        if (t === 'dark') document.body.classList.add('dark-theme'); else document.body.classList.remove('dark-theme');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = t === 'dark' ? '☀' : '🌙';
    };

    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.type = 'button';
    themeBtn.title = 'Toggle theme';
    document.body.appendChild(themeBtn);
    themeBtn.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });
    applyTheme(theme);

    // --- Project details modal ---
    function openModal({img, title, description, link}){
        const backdrop = document.createElement('div'); backdrop.className = 'modal-backdrop';
        const modal = document.createElement('div'); modal.className = 'modal';
        modal.innerHTML = `
            <button class="close" aria-label="Close">&times;</button>
            <h3>${title}</h3>
            ${img ? `<img src="${img}" alt="${title}">` : ''}
            <p>${description}</p>
            ${link ? `<p><a href="${link}" class="btn">Open project</a></p>` : ''}
        `;
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        modal.querySelector('.close').addEventListener('click', ()=> backdrop.remove());
        backdrop.addEventListener('click', (e)=> { if (e.target === backdrop) backdrop.remove(); });
        const escHandler = (e) => { if (e.key === 'Escape') { backdrop.remove(); document.removeEventListener('keydown', escHandler); } };
        document.addEventListener('keydown', escHandler);
    }

    document.querySelectorAll('.project-card').forEach(card => {
        const link = card.querySelector('.btn');
        if (!link) return;
        const href = (link.getAttribute('href') || '').trim();
        // For placeholder links (#), show modal; for real pages, allow navigation
        if (href === '#' || href === '') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const imgEl = card.querySelector('.project-img');
                const img = imgEl ? imgEl.getAttribute('src') : '';
                const title = (card.querySelector('h3') || {}).textContent || '';
                const description = (card.querySelector('p') || {}).textContent || '';
                openModal({img, title, description, link: null});
            });
        }
    });

    // --- Project search & filter ---
    const searchInput = document.getElementById('project-search');
    const filterSelect = document.getElementById('project-filter');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));

    const normalize = s => (s||'').toString().toLowerCase();
    function applyProjectFilter(){
        const q = normalize(searchInput && searchInput.value);
        const filter = (filterSelect && filterSelect.value) || 'all';
        projectCards.forEach(card => {
            const title = normalize(card.querySelector('h3') && card.querySelector('h3').textContent);
            // description: first paragraph within card-body
            const descEl = card.querySelector('.card-body p');
            const desc = normalize(descEl && descEl.textContent);
            // tags
            const tagEls = Array.from(card.querySelectorAll('.proj-tags span'));
            const tags = tagEls.map(t => normalize(t.textContent));

            const matchesQuery = q === '' || title.includes(q) || desc.includes(q) || tags.join(' ').includes(q);
            const matchesFilter = filter === 'all' || tags.includes(filter);

            if (matchesQuery && matchesFilter) card.style.display = '';
            else card.style.display = 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', applyProjectFilter);
    if (filterSelect) filterSelect.addEventListener('change', applyProjectFilter);

    // initialize filter state from URL hash (optional): #filter=linux
    try {
        const params = new URLSearchParams(window.location.search);
        const f = params.get('filter');
        if (f && filterSelect) { filterSelect.value = f; }
    } catch(e) {}
    applyProjectFilter();

    // --- Smooth scroll for internal anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const hash = a.getAttribute('href');
            const target = document.querySelector(hash);
            if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); history.pushState(null, '', hash); }
        });
    });

    // --- Simple form validation ---
    // Contact form validation + draft saving
    const contactForm = document.getElementById('contact-form');
    const draftKey = 'contact_draft_v1';
    function loadDraft(){
        try{
            const raw = localStorage.getItem(draftKey);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.name) document.getElementById('name').value = data.name;
            if (data.email) document.getElementById('email').value = data.email;
            if (data.message) document.getElementById('message').value = data.message;
            const notice = document.getElementById('draft-notice');
            if (notice) notice.textContent = 'Draft loaded from browser storage.';
        }catch(e){ console.warn('Load draft failed', e); }
    }
    function saveDraft(){
        try{
            const data = {
                name: document.getElementById('name').value || '',
                email: document.getElementById('email').value || '',
                message: document.getElementById('message').value || ''
            };
            localStorage.setItem(draftKey, JSON.stringify(data));
            const notice = document.getElementById('draft-notice'); if (notice) notice.textContent = 'Draft saved.';
        }catch(e){ console.warn('Save draft failed', e); }
    }
    function clearDraft(){
        localStorage.removeItem(draftKey);
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
        const notice = document.getElementById('draft-notice'); if (notice) notice.textContent = 'Draft cleared.';
    }

    if (contactForm){
        // load draft on start
        loadDraft();

        // auto-save on input (debounced)
        let timer = null;
        ['input','change'].forEach(evt => contactForm.addEventListener(evt, ()=>{
            clearTimeout(timer); timer = setTimeout(saveDraft, 600);
        }));

        const saveBtn = document.getElementById('save-draft');
        const clearBtn = document.getElementById('clear-draft');
        if (saveBtn) saveBtn.addEventListener('click', (e)=>{ e.preventDefault(); saveDraft(); });
        if (clearBtn) clearBtn.addEventListener('click', (e)=>{ e.preventDefault(); clearDraft(); });

        contactForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            if (!name){ alert('Please enter your name.'); document.getElementById('name').focus(); return; }
            if (!email){ alert('Please enter your email.'); document.getElementById('email').focus(); return; }
            if (!message){ alert('Please enter a message.'); document.getElementById('message').focus(); return; }

            // Save message to localStorage
            try{
                const messagesKey = 'contact_messages_v1';
                const existing = localStorage.getItem(messagesKey);
                const messages = existing ? JSON.parse(existing) : [];
                messages.push({
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem(messagesKey, JSON.stringify(messages));
                clearDraft();
                alert('Message sent successfully! You can view it in Messages page.');
            }catch(e){ 
                console.warn('Save message failed', e);
                alert('Error saving message.');
            }
        });
    }
});
