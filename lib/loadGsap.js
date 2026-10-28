// GSAP с ScrollTrigger (~45 КБ) нужен только для анимаций ниже первого экрана,
// поэтому грузится отдельным чанком после гидратации, а не вместе с главным фото.
let promise;

export function loadGsap() {
  promise ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return promise;
}
