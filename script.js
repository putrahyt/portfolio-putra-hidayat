/* ════════════════════════════════════════════
   PUTRA HIDAYAT PORTFOLIO v2 — script.js
   ════════════════════════════════════════════ */

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

/* ── Typed Text ── */
const roles = [
  'Web Developer',
  'Graphic Designer',
  'PHP & Laravel Developer',
  'Video Editor',
  'Tech & Web Enthusiast',
];

let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const cur = roles[rIdx];
  if (deleting) {
    typedEl.textContent = cur.substring(0, cIdx - 1);
    cIdx--;
  } else {
    typedEl.textContent = cur.substring(0, cIdx + 1);
    cIdx++;
  }
  if (!deleting && cIdx === cur.length) {
    setTimeout(() => { deleting = true; }, 1800);
  } else if (deleting && cIdx === 0) {
    deleting = false;
    rIdx = (rIdx + 1) % roles.length;
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((sib, i) => { if (sib === entry.target) delay = i * 100; });
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Gallery Filter ── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => { item.classList.add('hidden'); }, 300);
      }
    });
  });
});

/* ── Gallery item click — lightbox-style zoom ── */
document.querySelectorAll('.design-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.design-title')?.textContent || '';
    const size  = card.querySelector('.design-size')?.textContent  || '';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(16px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn .25s ease;
      cursor: pointer;
    `;

    // Clone the card's background for the preview
    const preview = document.createElement('div');
    preview.style.cssText = `
      width: min(90vw, 800px);
      height: min(70vh, 500px);
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      animation: scaleIn .25s ease;
      cursor: default;
    `;

    // Use same gradient as the original card
    const computedBg = window.getComputedStyle(card).background;
    const inner = document.createElement('div');
    inner.style.cssText = `width:100%; height:100%; background: ${computedBg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 1rem; padding: 2rem;`;

    const emoji = card.querySelector('.design-emoji')?.textContent || '🎨';
    inner.innerHTML = `
      <span style="font-size:5rem">${emoji}</span>
      <h3 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700; color:#fff; text-align:center;">${title}</h3>
      <span style="font-family:'Outfit',sans-serif; background:rgba(255,255,255,0.15); color:#fff; padding:6px 18px; border-radius:100px; font-size:0.9rem;">${size}</span>
      <p style="font-family:'Outfit',sans-serif; color:rgba(255,255,255,0.5); font-size:0.8rem; margin-top:1rem;">Ganti dengan gambar desain asli kamu</p>
    `;

    preview.appendChild(inner);
    overlay.appendChild(preview);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  });
});

/* Inject keyframes for lightbox */
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
`;
document.head.appendChild(lbStyle);

/* ── Contact Form ── */
const form       = document.getElementById('contactForm');
const formOk     = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Mengirim... ✦';
  btn.disabled = true;

  setTimeout(() => {
    formOk.classList.add('show');
    form.reset();
    btn.textContent = 'Kirim Pesan ✦';
    btn.disabled = false;
    setTimeout(() => formOk.classList.remove('show'), 5000);
  }, 1200);
});

/* ── Input Focus Label Color ── */
document.querySelectorAll('.fgroup input, .fgroup textarea, .fgroup select').forEach(el => {
  el.addEventListener('focus', () => {
    el.closest('.fgroup')?.querySelector('label')?.style.setProperty('color', 'var(--pink)');
  });
  el.addEventListener('blur', () => {
    el.closest('.fgroup')?.querySelector('label')?.style.removeProperty('color');
  });
});

/* ── Smooth page load ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});