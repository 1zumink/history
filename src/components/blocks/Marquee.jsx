import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Бегущая строка, которая ускоряется, когда быстро скроллишь
export default function Marquee({ block }) {
  const { text, dark, reverse } = block;
  const ref = useRef(null);
  const words = Array.from({ length: 6 }, () => text);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const loop = gsap.fromTo(
        '.marquee-track',
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 28, ease: 'none', repeat: -1 }
      );
      let settle;
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 250);
          gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true });
          settle?.kill();
          settle = gsap.delayedCall(0.15, () => gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true }));
        },
      });
    },
    { scope: ref }
  );

  return (
    <section className={`marquee ${dark ? 'dark' : ''} ${reverse ? 'tilt-r' : ''}`} ref={ref} aria-label={text}>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {words.map((w, i) => (
              <span key={i}>
                {w}
                <em>*</em>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
