// ═══ SCROLL REVEAL ═══
document.addEventListener('DOMContentLoaded', () => {
  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Active nav link
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinksEl.classList.toggle('open');
      menuToggle.textContent = navLinksEl.classList.contains('open') ? '✕' : '☰';
    });
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Tab system
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-container');
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      group.querySelector('#' + btn.dataset.tab).classList.add('active');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Typing effect for hero subtitle
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const text = typingEl.dataset.text;
    typingEl.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        typingEl.textContent += text[i];
        i++;
        setTimeout(type, 40);
      }
    };
    setTimeout(type, 1200);
  }

  // Counter animation for stats
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let count = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          el.textContent = count + (el.dataset.suffix || '');
        }, 30);
        obs.unobserve(el);
      }
    });
    obs.observe(el);
  });

  // ═══ AUTOAVALUACIÓ FORM ═══
  // Rating button selection
  document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.rating-group');
      group.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Calculate results
  const calcBtn = document.getElementById('calcResultBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const categories = [
        { name: 'Resolució de Conflictes', prefix: 'rc', count: 4 },
        { name: 'Organització del Treball', prefix: 'ot', count: 3 },
        { name: 'Treball en Equip', prefix: 'te', count: 4 },
        { name: 'Autonomia', prefix: 'au', count: 3 },
        { name: 'Responsabilitat', prefix: 're', count: 5 },
        { name: 'Relació Interpersonal', prefix: 'ri', count: 5 },
        { name: 'Innovació', prefix: 'in', count: 3 }
      ];

      let allAnswered = true;
      const results = [];

      categories.forEach(cat => {
        let sum = 0, answered = 0;
        for (let i = 1; i <= cat.count; i++) {
          const group = document.querySelector(`.rating-group[data-name="${cat.prefix}${i}"]`);
          const selected = group ? group.querySelector('.rating-btn.selected') : null;
          if (selected) { sum += parseInt(selected.dataset.value); answered++; }
        }
        if (answered < cat.count) allAnswered = false;
        results.push({ name: cat.name, avg: answered > 0 ? (sum / cat.count) : 0, answered });
      });

      if (!allAnswered) {
        alert("Si us plau, respon totes les preguntes abans de calcular els resultats.");
        return;
      }

      const barsEl = document.getElementById('autoeval-bars');
      const totalEl = document.getElementById('autoeval-total');
      const resultsEl = document.getElementById('autoeval-results');

      barsEl.innerHTML = '';
      let grandTotal = 0;
      results.forEach(r => {
        grandTotal += r.avg;
        const pct = (r.avg / 5) * 100;
        const item = document.createElement('div');
        item.className = 'autoeval-bar-item';
        item.innerHTML = `<span class="bar-label">${r.name}</span><div class="bar-track"><div class="bar-fill" style="width:0%">${r.avg.toFixed(1)}</div></div>`;
        barsEl.appendChild(item);
        setTimeout(() => { item.querySelector('.bar-fill').style.width = pct + '%'; }, 100);
      });

      const avgTotal = grandTotal / results.length;
      totalEl.innerHTML = `<div class="total-score">${avgTotal.toFixed(2)} / 5</div><div class="total-label">Nota Mitjana Global de Capacitats Clau</div>`;
      resultsEl.style.display = 'block';
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
