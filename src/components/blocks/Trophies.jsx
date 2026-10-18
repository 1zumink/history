import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';
import { plural } from '../../lib/utils';

// Витрина всех достижений, собранных по пути
export default function Trophies({ story, config }) {
  const ref = useRef(null);
  const list = [config.gate?.achievement, ...story.filter((b) => b.type === 'achievement')].filter(Boolean);
  const n = list.length;

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.trophy', {
        scale: 0.4,
        opacity: 0,
        rotation: () => gsap.utils.random(-15, 15),
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: { each: 0.08, from: 'random' },
        scrollTrigger: { trigger: '.trophies-grid', start: 'top 80%' },
      });
    },
    { scope: ref }
  );

  return (
    <section className="trophies" ref={ref}>
      <div className="stretch">
      <SplitText
        tag="h3"
        text={`${n} ${plural(n, ['достижение', 'достижения', 'достижений'])} из ${n}`}
        className="trophies-title"
        effect="rise"
        mask
        splitType="chars"
        delay={30}
      />
      </div>
      <p className="trophies-sub">собраны все. но это только начало</p>
      <div className="trophies-grid">
        {list.map((a, i) => (
          <div className="trophy" key={i}>
            <div className="trophy-card">
              <div className="trophy-icon">{a.icon || '🏆'}</div>
              <div className="trophy-title">{a.title}</div>
              {a.desc && <div className="trophy-desc">{a.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
