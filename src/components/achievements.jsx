import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MQ } from '../lib/utils';

const AchievementContext = createContext({ unlock: () => {} });

export const useAchievements = () => useContext(AchievementContext);

// Очередь: на экране всегда одна плашка, следующие ждут.
export function AchievementProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const seen = useRef(new Set());

  const unlock = useCallback((achievement) => {
    const id = achievement.id || achievement.title;
    if (seen.current.has(id)) return;
    seen.current.add(id);
    setQueue((q) => [...q, { ...achievement, id }]);
  }, []);

  const next = useCallback(() => setQueue((q) => q.slice(1)), []);
  const value = useMemo(() => ({ unlock }), [unlock]);

  return (
    <AchievementContext.Provider value={value}>
      {children}
      {queue[0] && <Toast key={queue[0].id} item={queue[0]} onDone={next} />}
    </AchievementContext.Provider>
  );
}

const SHOW_FOR = 3.8;

function Toast({ item, onDone }) {
  const ref = useRef(null);
  const closing = useRef(false);
  const [mobile] = useState(() => window.matchMedia(MQ.mobile).matches);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(ref.current, {
      y: mobile ? -100 : 100,
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: onDone,
    });
  }, [mobile, onDone]);

  useGSAP(
    () => {
      gsap
        .timeline()
        .from(ref.current, { y: mobile ? -140 : 140, scale: 0.8, opacity: 0, duration: 0.75, ease: 'back.out(1.6)' })
        .from('.toast-icon', { scale: 0, rotation: -40, duration: 0.7, ease: 'back.out(3)' }, 0.2)
        .to('.toast-icon', { keyframes: { rotation: [0, -14, 12, -8, 5, 0] }, duration: 0.7, ease: 'power1.inOut' }, 0.9)
        .fromTo('.toast-bar', { scaleX: 1 }, { scaleX: 0, duration: SHOW_FOR, ease: 'none' }, 0)
        .add(close, SHOW_FOR);
    },
    { scope: ref }
  );

  return (
    <div className="toast" ref={ref} role="status" aria-live="polite" onClick={close}>
      <div className="toast-icon">{item.icon || '🏆'}</div>
      <div className="toast-body">
        <div className="toast-label">Достижение получено</div>
        <div className="toast-title">{item.title}</div>
        {item.desc && <div className="toast-desc">{item.desc}</div>}
      </div>
      <div className="toast-bar" />
    </div>
  );
}
