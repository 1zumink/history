import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';
import { MQ, longestWord } from '../../lib/utils';

export default function ChapterTitle({ block, index = 0 }) {
  const { title, subtitle, date, place } = block;
  const align = block.align || (index % 2 ? 'right' : 'left');
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ...MQ }, ({ conditions: { reduce } }) => {
        if (reduce) return;
        const st = { trigger: ref.current, start: 'top 75%' };
        gsap.from('.chapter-tag', { scale: 0, rotation: align === 'right' ? 12 : -12, duration: 0.8, ease: 'back.out(2)', scrollTrigger: st });
      });
    },
    { scope: ref }
  );

  return (
    <section className={`chapter a-${align} ${block.ghost ? 'ghost' : ''}`} ref={ref}>
      {(date || place) && (
        <div className="chapter-tag">
          {date && <span>{date}</span>}
          {place && <span>{place}</span>}
        </div>
      )}
      <div className="stretch" style={{ '--len': longestWord(title) }}>
        <SplitText
          tag="h2"
          text={title}
          className="chapter-title"
          effect="rise"
          mask
          splitType="chars"
          delay={30}
          duration={1.1}
          textAlign={align}
        />
      </div>
      {subtitle && (
        <SplitText text={subtitle} className="chapter-sub" effect="blur" splitType="words" delay={90} textAlign={align} />
      )}
    </section>
  );
}
