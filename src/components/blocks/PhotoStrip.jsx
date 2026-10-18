import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';
import Media from '../Media';
import { MQ, longestWord } from '../../lib/utils';

const ROT = [2, -2.5, 1.5, -2, 3, -1];

// Горизонтальная лента: на десктопе едет вбок при скролле вниз, на телефоне — свайп
export default function PhotoStrip({ block }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const items = gsap.utils.toArray('.strip-item', ref.current);

      mm.add({ ...MQ }, ({ conditions: { desktop, reduce } }) => {
        if (reduce) return;
        if (!desktop) {
          gsap.from(items, {
            x: 120,
            opacity: 0,
            rotation: 8,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: 'top 75%' },
          });
          return;
        }
        const track = ref.current.querySelector('.strip-track');
        const distance = () => track.scrollWidth - window.innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        items.forEach((item, i) => {
          gsap.from(item.querySelector('.strip-fly'), {
            scale: 0.6,
            rotation: ROT[i % ROT.length] * 4,
            yPercent: i % 2 ? -30 : 30,
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: item, containerAnimation: move, start: 'left 105%', end: 'left 55%', scrub: true },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="strip" ref={ref}>
      <div className="strip-track">
        {(block.title || block.subtitle) && (
          <div className="strip-head">
            {block.title && (
              <div className="stretch" style={{ '--len': longestWord(block.title) }}>
                <SplitText tag="h3" text={block.title} className="strip-title" effect="rise" mask splitType="chars" delay={50} textAlign="left" />
              </div>
            )}
            {block.subtitle && <p className="strip-sub">{block.subtitle}</p>}
          </div>
        )}
        {block.items.map((item, i) => (
          <div key={i} className={`strip-item sz-${item.size || 'm'}`} style={{ '--shift': i % 2 ? 1 : -1 }}>
            <figure className="strip-fly" style={{ rotate: `${item.rotate ?? ROT[i % ROT.length] / 2}deg` }}>
              <Media src={item.src} alt={item.caption} ratio={item.ratio || '3/4'} />
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
