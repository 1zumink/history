import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';
import Media from '../Media';
import { MQ } from '../../lib/utils';

const RATIO = ['4/3', '3/4', '1/1'];
const SPEED = [-0.4, 0.5, 1];

// 2–3 фото внахлёст, каждое плывёт со своей скоростью
export default function PhotoCollage({ block }) {
  const ref = useRef(null);
  const items = block.items.slice(0, 3);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ...MQ }, ({ conditions: { desktop, reduce } }) => {
        const pieces = gsap.utils.toArray('.collage-item', ref.current);
        if (reduce) {
          gsap.from(pieces, { opacity: 0, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
          return;
        }
        pieces.forEach((el, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } })
            .fromTo(
              el.querySelector('.collage-reveal'),
              { clipPath: i % 2 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' },
              i * 0.12
            )
            .fromTo(el.querySelector('.media'), { scale: 1.5 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, i * 0.12);
          const amp = (desktop ? 110 : 50) * SPEED[i];
          gsap.fromTo(
            el,
            { y: amp },
            {
              y: -amp,
              ease: 'none',
              scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="collage-wrap">
      <div className={`collage n${items.length}`} ref={ref}>
        {items.map((item, i) => (
          <figure key={i} className={`collage-item c${i}`}>
            <div className="collage-reveal">
              <Media src={item.src} alt={item.caption} ratio={item.ratio || RATIO[i]} />
            </div>
          </figure>
        ))}
        {block.text && (
          <div className="collage-text">
            <SplitText text={block.text} className="collage-note" effect="blur" splitType="words" delay={70} textAlign="left" />
          </div>
        )}
      </div>
    </section>
  );
}
