import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Media from '../Media';
import { MQ } from '../../lib/utils';

const ROT = [-2, 1.5, -1, 2.5, -3, 1, -1.5, 2];
const OFFSET = [0, 9, 3, 14, 6, 11, 2, 8]; // вертикальный сдвиг на десктопе, vw
const DRIFT = [-1, 0.6, -0.3, 1, -0.7, 0.4];
const DEFAULT_RATIO = { s: '4/5', m: '4/5', l: '4/5', xl: '3/2' };

// Фото, которые влетают из-за краёв экрана с разворотом
export default function PhotoScatter({ block }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ...MQ }, ({ conditions: { desktop, reduce } }) => {
        gsap.utils.toArray('.scatter-item', ref.current).forEach((item, i) => {
          const fly = item.querySelector('.scatter-fly');
          const st = { trigger: item, start: 'top 90%' };
          if (reduce) {
            gsap.from(fly, { opacity: 0, duration: 0.8, scrollTrigger: st });
            return;
          }
          const rect = item.getBoundingClientRect();
          const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? -1 : 1;
          const rot = parseFloat(item.dataset.rot);
          gsap.fromTo(
            fly,
            {
              x: side * window.innerWidth * (desktop ? 0.55 : 0.8),
              y: desktop ? 180 : 90,
              rotation: rot + side * 38,
              scale: 0.55,
              opacity: 0,
            },
            { x: 0, y: 0, rotation: rot, scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: st }
          );
          if (desktop) {
            gsap.fromTo(
              item,
              { y: DRIFT[i % DRIFT.length] * 70 },
              {
                y: DRIFT[i % DRIFT.length] * -70,
                ease: 'none',
                scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
              }
            );
          }
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="scatter" ref={ref}>
      {block.items.map((item, i) => {
        const rot = item.rotate ?? ROT[i % ROT.length];
        const size = item.size || (item.note ? 's' : 'm');
        return (
          <div
            key={i}
            className={`scatter-item sz-${size}`}
            data-rot={rot}
            style={{ '--off': OFFSET[i % OFFSET.length], '--rot': `${rot}deg`, zIndex: i + 1 }}
          >
            <div className="scatter-fly">
              {item.note ? (
                <div className="note">{item.note}</div>
              ) : (
                <figure className="shot">
                  <Media src={item.src} alt={item.caption} ratio={item.ratio || DEFAULT_RATIO[size]} />
                  {item.caption && <figcaption>{item.caption}</figcaption>}
                </figure>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
