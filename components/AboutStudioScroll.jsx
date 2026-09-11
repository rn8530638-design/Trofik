'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutStudio.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Total scroll distance the pin lasts for, as extra viewport height. Tune pacing here.
const PIN_END = '+=250%';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

export default function AboutStudioScroll({ heading, slides, images }) {
  const rootRef = useRef(null);
  const sectionRef = useRef(null);
  const slide1GroupRef = useRef(null);
  const slide2Ref = useRef(null);
  const slide3Ref = useRef(null);
  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  const photo3Ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set([slide2Ref.current, slide3Ref.current], { opacity: 0, y: 36 });
        gsap.set([photo2Ref.current, photo3Ref.current], { opacity: 0, scale: 1.04 });
        gsap.set(slide1GroupRef.current, { opacity: 1, y: 0 });
        gsap.set(photo1Ref.current, { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: PIN_END,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.addLabel('slide1')
          .to(slide1GroupRef.current, { opacity: 0, y: -36, duration: 1 }, 'phase2')
          .to(photo1Ref.current, { opacity: 0, scale: 1.04, duration: 1 }, 'phase2')
          .to(slide2Ref.current, { opacity: 1, y: 0, duration: 1 }, 'phase2+=0.35')
          .to(photo2Ref.current, { opacity: 1, scale: 1, duration: 1 }, 'phase2+=0.35')
          .addLabel('slide2')
          .to(slide2Ref.current, { opacity: 0, y: -36, duration: 1 }, 'phase3')
          .to(photo2Ref.current, { opacity: 0, scale: 1.04, duration: 1 }, 'phase3')
          .to(slide3Ref.current, { opacity: 1, y: 0, duration: 1 }, 'phase3+=0.35')
          .to(photo3Ref.current, { opacity: 1, scale: 1, duration: 1 }, 'phase3+=0.35')
          .addLabel('slide3')
          .to({}, { duration: 0.6 });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.about} aria-labelledby="about-title">
      <div ref={rootRef} className={styles.container}>
        <div className={styles.photoCol}>
          <div className={styles.photoFrame}>
            <div className={styles.photoStage} aria-label="Фотографии студии ТрофиК">
              <div ref={photo1Ref} className={styles.photoSlide}>
                <Image className={styles.photo} src={images[0]} alt="Студия красоты ТрофиК" fill priority sizes="(min-width: 1024px) 48vw, 100vw" />
              </div>
              <div ref={photo2Ref} className={`${styles.photoSlide} ${styles.photoHidden}`}>
                <Image className={styles.photo} src={images[1]} alt="Работа мастера студии ТрофиК" fill sizes="(min-width: 1024px) 48vw, 100vw" />
              </div>
              <div ref={photo3Ref} className={`${styles.photoSlide} ${styles.photoHidden}`}>
                <Image className={styles.photo} src={images[2]} alt="Образ, созданный в студии ТрофиК" fill sizes="(min-width: 1024px) 48vw, 100vw" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.textCol}>
          <div className={styles.stage}>
            <div ref={slide1GroupRef} className={`${styles.slideWrap} ${styles.slide1Wrap}`}>
              <div className={styles.slide1Inner}>
                <span className={styles.marker} aria-hidden="true" />
                <h2 id="about-title" className={styles.title}>
                  {heading}
                </h2>
                <p className={styles.slideText}>{slides[0]}</p>
              </div>
            </div>

            <div ref={slide2Ref} className={`${styles.slideWrap} ${styles.slideHidden}`}>
              <p className={styles.slideText}>{slides[1]}</p>
            </div>

            <div ref={slide3Ref} className={`${styles.slideWrap} ${styles.slideHidden}`}>
              <p className={styles.slideText}>{slides[2]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
