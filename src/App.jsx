import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Gate from './components/Gate';
import Intro from './components/Intro';
import DaysBadge from './components/DaysBadge';
import StoryRenderer from './components/StoryRenderer';
import { AchievementProvider, useAchievements } from './components/achievements';
import { config, story } from './data/story';
import { isUnlocked, rememberUnlock } from './lib/gate';
import { startSmoothScroll, stopSmoothScroll } from './lib/smoothScroll';

export default function App() {
  const [unlocked, setUnlocked] = useState(() => isUnlocked(config.gate.answerHash));
  const [fresh, setFresh] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  if (!unlocked) {
    return (
      <Gate
        gate={config.gate}
        onUnlock={() => {
          rememberUnlock(config.gate.answerHash);
          window.scrollTo(0, 0);
          setFresh(true);
          setUnlocked(true);
        }}
      />
    );
  }

  return (
    <AchievementProvider>
      <Story fresh={fresh} />
    </AchievementProvider>
  );
}

function Story({ fresh }) {
  const { unlock } = useAchievements();

  useEffect(() => {
    startSmoothScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    // Фото подгружаются лениво — пересчитываем позиции после полной загрузки
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      stopSmoothScroll();
    };
  }, []);

  useEffect(() => {
    if (!fresh || !config.gate.achievement) return undefined;
    const id = setTimeout(() => unlock(config.gate.achievement), 2200);
    return () => clearTimeout(id);
  }, [fresh, unlock]);

  return (
    <main className="story">
      {fresh && <Curtain />}
      <DaysBadge startDate={config.startDate} delay={fresh ? 1 : 0} />
      <Intro config={config} delay={fresh ? 0.6 : 0} />
      <StoryRenderer story={story} config={config} />
      <footer className="footer">сделано с любовью · только для тебя</footer>
    </main>
  );
}

// Чёрная шторка после ввода пароля уезжает вверх и открывает историю
function Curtain() {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);
  useGSAP(() => {
    gsap.to(ref.current, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 1.2,
      ease: 'power4.inOut',
      delay: 0.15,
      onComplete: () => setGone(true),
    });
  });
  return gone ? null : <div className="curtain" ref={ref} />;
}
