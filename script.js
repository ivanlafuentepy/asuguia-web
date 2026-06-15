// AsuGuía — interacciones mínimas (vanilla, sin dependencias)

// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Nav: sombra al scrollear
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Nav móvil: abrir/cerrar
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
const setMenu = (open) => {
  links.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
};
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
// Cerrar al tocar un link
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});
