import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('[data-scroll-progress]');

if (!reduceMotion) {
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('[data-split]').forEach((title) => {
    const nodes = [...title.childNodes];
    title.textContent = '';
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((word) => {
          if (!word.trim()) return title.append(' ');
          const wrap = document.createElement('span'); wrap.className = 'word-mask';
          const inner = document.createElement('span'); inner.textContent = word;
          wrap.append(inner); title.append(wrap, ' ');
        });
      } else {
        node.textContent.split(/(\s+)/).forEach((word) => {
          if (!word.trim()) return title.append(' ');
          const wrap = document.createElement('span'); wrap.className = 'word-mask';
          const inner = node.cloneNode(false); inner.textContent = word;
          wrap.append(inner); title.append(wrap, ' ');
        });
      }
    });
    gsap.from(title.querySelectorAll('.word-mask > *'), { yPercent: 110, duration: .9, stagger: .045, ease: 'power4.out', delay: .12 });
  });

  gsap.utils.toArray('.reveal').forEach((item) => gsap.from(item, { y: 34, opacity: 0, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%', once: true } }));

  const animatePath = (selector, trigger, duration = 2) => {
    const path = document.querySelector(selector);
    if (!path) return;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, { strokeDashoffset: 0, duration, ease: 'power2.inOut', scrollTrigger: { trigger, start: 'top 75%', once: true } });
  };
  animatePath('[data-flow-path]', '.system-visual', 2.3);
  animatePath('[data-architecture-path]', '.architecture', 1.8);

  gsap.to('.system-visual__canvas svg', { rotation: 7, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
  gsap.from('.donut__50,.donut__30,.donut__20', { strokeDashoffset: 490, duration: 1.4, stagger: .15, ease: 'power2.out', scrollTrigger: { trigger: '.payment-visual', start: 'top 75%', once: true } });
}

const updateProgress = () => {
  if (!progress) return;
  const total = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
