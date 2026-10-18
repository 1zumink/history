import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Media from '../Media';
import { MQ, ratioNumber } from '../../lib/utils';

export default function VideoBlock({ block }) {
  const { src, poster, ratio = '16/9', size = 'l', caption } = block;
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  // Играет только когда видно, иначе пауза — бережём батарею
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ...MQ }, ({ conditions: { reduce } }) => {
        if (reduce) return;
        gsap.fromTo(
          '.video-frame',
          { clipPath: 'inset(14% 18% 14% 18%)', scale: 0.92 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'center 55%', scrub: 1 },
          }
        );
        gsap.from('.video-caption', { y: 20, opacity: 0, duration: 1, scrollTrigger: { trigger: '.video-caption', start: 'top 92%' } });
      });
    },
    { scope: ref }
  );

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  return (
    <section className={`video-block sz-${size}`} ref={ref} style={{ '--r': ratioNumber(ratio, 16 / 9) }}>
      <div className="video-frame">
        <Media src={src} poster={poster} ratio={ratio} video videoRef={videoRef} />
        <button className="video-sound" onClick={toggleSound} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
          {muted ? 'звук выкл' : 'звук вкл'}
        </button>
      </div>
      {caption && <p className="video-caption">{caption}</p>}
    </section>
  );
}
