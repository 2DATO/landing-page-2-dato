/* ===================================================================
   2Dato Landing Page — Main JavaScript
   El desplazamiento a anclas lo hace el navegador (scroll-behavior +
   scroll-padding-top en styles.css). Aquí: altura del nav y la animación
   de entrada.
   =================================================================== */

/* Altura real del nav para scroll-padding-top; cambia con el idioma, el
   ancho y la carga de fuentes, por eso se observa el elemento y no el resize. */
const nav = document.querySelector('nav.nav');
if (nav) {
    new ResizeObserver(() =>
        document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px')
    ).observe(nav);
}

/* Animación de entrada, una sola vez por bloque. El contenido es visible por
   defecto; solo se oculta (html.reveal) si este script corre y el usuario no
   pide movimiento reducido. Lo que ya está en pantalla al cargar no se anima,
   para no hacerlo parpadear. Con #ancla en la URL no se anima nada: el salto
   ocurre después de este script y esconderíamos la sección de destino. */
const revealItems = document.querySelectorAll('[data-animate]');
if (
    revealItems.length &&
    !location.hash &&
    matchMedia('(prefers-reduced-motion: no-preference)').matches
) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const siblingsSeen = new Map();
    revealItems.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('in-view');
            return;
        }
        const n = siblingsSeen.get(el.parentElement) || 0;
        siblingsSeen.set(el.parentElement, n + 1);
        el.style.setProperty('--reveal-delay', `${Math.min(n, 6) * 60}ms`);
        observer.observe(el);
    });

    document.documentElement.classList.add('reveal');
}
