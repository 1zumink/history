import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from './SplitText';
import Media from './Media';
import { MQ, longestWord } from '../lib/utils';

export default function Intro({ config, delay = 0 }) {
  const ref = useRef(null);
  const photos = (config.introPhotos || []).slice(0, 4);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ...MQ }, ({ conditions: { reduce } }) => {
        if (reduce) return;
        gsap.from('.intro-photo', { scale: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: delay + 0.8 });
        gsap.from('.intro-scroll', { opacity: 0, duration: 1, delay: delay + 1.4 });
        gsap.to('.intro-title-wrap', {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="intro" ref={ref}>
      {photos.map((src, i) => (
        <div key={src} className={`intro-photo p${i}`}>
          <Media src={src} ratio={i % 2 ? '4/5' : '1/1'} />
        </div>
      ))}

      <div className="intro-title-wrap">
        <div className="stretch" style={{ '--len': longestWord(config.title) }}>
          <SplitText
            tag="h1"
            text={config.title}
            className="intro-title"
            effect="rise"
            mask
            splitType="chars"
            trigger="load"
            delay={45}
            duration={1.3}
          />
        </div>
        <SplitText
          text={config.names}
          className="intro-names"
          effect="blur"
          splitType="words"
          trigger="load"
          delay={160}
          duration={1.6}
        />
      </div>

      <div className="intro-scroll">↓</div>
    </section>
  );
}
