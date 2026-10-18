import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { plural } from '../lib/utils';

const DAY = 864e5;
const pad = (n) => String(n).padStart(2, '0');

// Маленький счётчик «N дней вместе» в правом верхнем углу
export default function DaysBadge({ startDate, delay = 0 }) {
  const ref = useRef(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    gsap.from(ref.current, { y: -20, opacity: 0, duration: 0.8, ease: 'expo.out', delay: delay + 1 });
  });

  const diff = Math.max(0, now - new Date(startDate));
  const days = Math.floor(diff / DAY);
  const rest = diff % DAY;
  const clock = `${pad(Math.floor(rest / 36e5))}:${pad(Math.floor((rest % 36e5) / 6e4))}:${pad(Math.floor((rest % 6e4) / 1e3))}`;

  return (
    <div className="days-badge" ref={ref} aria-label={`Вместе ${days} ${plural(days, ['день', 'дня', 'дней'])}`}>
      <b>
        {days} {plural(days, ['день', 'дня', 'дней'])} вместе
      </b>
      <span>{clock}</span>
    </div>
  );
}
