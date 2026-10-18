import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { mediaUrl } from '../../lib/utils';

// Телеграм-кружки: круглые видео рядом, звук — по тапу
export default function VideoCircles({ block }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.circle', {
        scale: 0.6,
        rotation: (i) => (i % 2 ? 14 : -14),
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    },
    { scope: ref }
  );

  return (
    <section className="circles" ref={ref}>
      {block.items.map((src, i) => (
        <Circle key={src} src={src} index={i} />
      ))}
    </section>
  );
}

function Circle({ src, index }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
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

  const toggle = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  return (
    <figure className={`circle c${index % 2}`}>
      <button className="circle-video" onClick={toggle} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
        <video ref={videoRef} src={mediaUrl(src)} muted loop playsInline preload="metadata" />
      </button>
      <figcaption>{muted ? 'звук выкл' : 'звук вкл'}</figcaption>
    </figure>
  );
}
