import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from '../SplitText';
import { plural } from '../../lib/utils';

const DAY = 864e5;
const pad = (n) => String(n).padStart(2, '0');

function breakdown(start, now) {
  let y = now.getFullYear() - start.getFullYear();
  let m = now.getMonth() - start.getMonth();
  let d = now.getDate() - start.getDate();
  if (d < 0) {
    m -= 1;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return [
    y && `${y} ${plural(y, ['год', 'года', 'лет'])}`,
    m && `${m} ${plural(m, ['месяц', 'месяца', 'месяцев'])}`,
    d && `${d} ${plural(d, ['день', 'дня', 'дней'])}`,
  ].filter(Boolean);
}

const joinRu = (parts) => (parts.length > 1 ? `${parts.slice(0, -1).join(', ')} и ${parts.at(-1)}` : parts[0] || '');

export default function Counter({ block, config }) {
  const start = new Date(block.startDate || config.startDate);
  const ref = useRef(null);
  const daysRef = useRef(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / DAY);
  const rest = diff % DAY;
  const clock = `${pad(Math.floor(rest / 36e5))}:${pad(Math.floor((rest % 36e5) / 6e4))}:${pad(Math.floor((rest % 6e4) / 1e3))}`;

  // Число дней «набегает» от нуля, когда блок появляется на экране
  useGSAP(
    () => {
      const el = daysRef.current;
      const target = Math.floor(Math.max(0, Date.now() - start) / DAY);
      const fmt = (v) => Math.round(v).toLocaleString('ru-RU');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = fmt(target);
        return;
      }
      el.textContent = '0';
      const counter = { v: 0 };
      gsap.to(counter, {
        v: target,
        duration: 2.6,
        ease: 'expo.out',
        onUpdate: () => (el.textContent = fmt(counter.v)),
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });
      gsap.from('.counter-days', {
        scale: 0.6,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });
    },
    { scope: ref }
  );

  return (
    <section className="counter" ref={ref}>
      <SplitText text={block.label || 'мы вместе уже'} className="counter-label" effect="blur" splitType="words" delay={90} />
      <div className="counter-days">
        <div className="stretch">
          <span ref={daysRef} className="counter-num" />
          <sup className="counter-star">*</sup>
        </div>
        <span className="counter-unit">{plural(days, ['день', 'дня', 'дней'])}</span>
      </div>
      <p className="counter-since">это {joinRu(breakdown(start, now))}</p>
      <p className="counter-clock">
        <span>и ещё</span> {clock}
      </p>
      <p className="counter-note">* и это только начало</p>
    </section>
  );
}
