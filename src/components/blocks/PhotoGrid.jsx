import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Media from '../Media';
import { ratioNumber } from '../../lib/utils';

// Компактная сетка маленьких фото — для серий похожих кадров
export default function PhotoGrid({ block }) {
  const ref = useRef(null);
  const { items } = block;
  const cols = block.cols || Math.min(6, items.length);
  const portrait = items.filter((i) => ratioNumber(i.ratio) < 1).length;
  const ratio = block.ratio || (portrait >= items.length / 2 ? '3/4' : '4/3');

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.grid-tile', {
        scale: 0.5,
        opacity: 0,
        rotation: () => gsap.utils.random(-8, 8),
        duration: 0.9,
        ease: 'back.out(1.6)',
        stagger: { each: 0.06, from: 'random' },
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    },
    { scope: ref }
  );

  return (
    <section className="photo-grid" ref={ref} style={{ '--cols': cols, '--cols-m': cols >= 4 ? 3 : 2 }}>
      {items.map((item, i) => (
        <figure key={i} className="grid-tile">
          <Media src={item.src} alt={item.caption} ratio={ratio} />
        </figure>
      ))}
    </section>
  );
}
