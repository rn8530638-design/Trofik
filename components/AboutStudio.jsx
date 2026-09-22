'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutStudio.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PARAGRAPHS = [
  'Я создала «ТрофиК» как место, куда девушка приходит за красотой, а уходит с ощущением, что о ней позаботились.',
  'Здесь не нужно спешить, соответствовать идеалам или заслуживать право на заботу о себе. Нет шаблонных фраз и заученной вежливости — есть искренность, теплота и живое общение.',
  'Можно остановиться на несколько часов, выдохнуть, выпить вкусный кофе, поговорить, посмеяться или побыть в тишине. И почувствовать себя красивой, уверенной и важной для самой себя.',
];

export default function AboutStudio() {
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = contentRef.current.querySelectorAll('[data-about-reveal]');
      const media = gsap.matchMedia();

      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          autoAlpha: 0,
          y: 14,
          duration: 0.72,
          stagger: 0.18,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          autoAlpha: 0,
          y: 10,
          duration: 0.42,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.photoFrame}>
          <Image
            className={styles.photo}
            src="/images/ekaterina.jpg"
            alt="Временное изображение студии красоты ТрофиК"
            fill
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 42vw, 520px"
          />
        </div>

        <div ref={contentRef} className={styles.content}>
          <span className={styles.marker} aria-hidden="true" data-about-reveal />
          <p className={styles.eyebrow} data-about-reveal>О студии</p>
          <h2 id="about-title" className={styles.title} data-about-reveal>
            <span className={styles.titleLine}>Место, куда хочется</span>
            <span className={styles.titleLine}>возвращаться</span>
          </h2>
          <div className={styles.copy}>
            {PARAGRAPHS.map((paragraph) => <p key={paragraph} data-about-reveal>{paragraph}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
