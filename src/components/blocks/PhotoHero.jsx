import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Media from '../Media';
import { MQ, longestWord } from '../../lib/utils';

// Одно фото: маленькое окно в центре раскрывается на весь экран, пока скроллишь
export default function PhotoHero({ block }) {
  const item = block.items[0];
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ...MQ }, ({ conditions: { desktop, reduce } }) => {
        if (reduce) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: desktop ? '+=130%' : '+=80%',
            pin: true,
            scrub: 1,
          },
        });
        tl.fromTo(
          '.hero-clip',
          { clipPath: desktop ? 'inset(24% 30% 24% 30%)' : 'inset(20% 12% 20% 12%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 },
          0
        )
          .fromTo('.hero-clip .media', { scale: 1.4 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo('.hero-title', { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.5)
          .fromTo('.hero-caption', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.75)
          .to({}, { duration: 0.25 });
      });
    },
    { scope: ref }
  );

  return (
    <section className="hero" ref={ref}>
      <div className="hero-clip">
        <Media src={item.src} alt={item.caption} fill />
      </div>
      {block.title && (
        <h3 className="hero-title" style={{ '--len': longestWord(block.title) }}>
          {block.title}
        </h3>
      )}
      {item.caption && <p className="hero-caption">{item.caption}</p>}
    </section>
  );
}
