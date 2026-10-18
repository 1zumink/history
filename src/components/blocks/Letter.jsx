import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';
import { longestWord } from '../../lib/utils';

const HEART =
  'M50 88 C 22 68, 5 50, 5 31 C 5 16, 16 6, 29 6 C 39 6, 46 12, 50 21 C 54 12, 61 6, 71 6 C 84 6, 95 16, 95 31 C 95 50, 78 68, 50 88';

export default function Letter({ block }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const path = ref.current.querySelector('.letter-heart path');
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.letter-sign', start: 'top 85%' },
      });
      gsap.from('.letter-paper', {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.letter-paper', start: 'top 85%' },
      });
    },
    { scope: ref }
  );

  return (
    <section className="letter" ref={ref}>
      <div className="stretch" style={{ '--len': longestWord(block.title || 'Письмо тебе') }}>
        <SplitText tag="h2" text={block.title || 'Письмо тебе'} className="letter-title" effect="rise" mask splitType="chars" delay={40} />
      </div>
      <div className="letter-paper">
        {block.paragraphs.map((p, i) => (
          <SplitText key={i} text={p} className="letter-p" effect="blur" splitType="words" delay={28} duration={1.1} textAlign="left" />
        ))}
        <div className="letter-sign">
          {block.signature && (
            <SplitText text={block.signature} className="letter-signature" effect="wave" splitType="chars" delay={45} textAlign="right" />
          )}
          <svg className="letter-heart" viewBox="0 0 100 94" aria-hidden="true">
            <path d={HEART} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
