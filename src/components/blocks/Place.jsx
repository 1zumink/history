import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';

// Локация внутри главы (например, места в Питере)
export default function Place({ block }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.place-line', {
        scaleX: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    },
    { scope: ref }
  );

  return (
    <section className="place" ref={ref}>
      <div className="place-row">
        <SplitText tag="h3" text={block.title} className="place-title" effect="rise" mask splitType="chars" delay={25} textAlign="left" />
        {block.date && <span className="place-date">{block.date}</span>}
      </div>
      <i className="place-line" />
    </section>
  );
}
