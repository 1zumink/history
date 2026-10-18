import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useAchievements } from '../achievements';

// Невидимый якорь: когда до него доскроллили — всплывает плашка достижения
export default function AchievementMarker({ block }) {
  const ref = useRef(null);
  const { unlock } = useAchievements();

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 75%', once: true, onEnter: () => unlock(block) });
    },
    { scope: ref, dependencies: [unlock] }
  );

  return <div ref={ref} className="ach-marker" aria-hidden="true" />;
}
