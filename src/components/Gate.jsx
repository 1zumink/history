import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from './SplitText';
import { checkAnswer } from '../lib/gate';

const WRONG = ['не-а 🙂', 'подумай ещё', 'почти… но нет', 'я в тебя верю', 'ещё разок'];

export default function Gate({ gate, onUnlock }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState('');
  const ref = useRef(null);
  const formRef = useRef(null);
  const btnRef = useRef(null);
  const inputRef = useRef(null);
  const wipeRef = useRef(null);
  const done = useRef(false);

  useGSAP(
    () => {
      gsap.from('.gate-label, .gate-form', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.15, delay: 0.5 });
    },
    { scope: ref }
  );

  const submit = (e) => {
    e.preventDefault();
    if (done.current || !value.trim()) return;

    if (checkAnswer(value, gate.answerHash)) {
      done.current = true;
      setMsg('');
      inputRef.current?.blur();
      const r = btnRef.current.getBoundingClientRect();
      const at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      gsap
        .timeline({ onComplete: onUnlock })
        .to('.gate-inner', { y: -30, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.1)
        .fromTo(
          wipeRef.current,
          { clipPath: `circle(0px at ${at})` },
          { clipPath: `circle(150vmax at ${at})`, duration: 1, ease: 'power3.inOut' },
          0.15
        );
      return;
    }

    setMsg(WRONG[tries % WRONG.length]);
    setTries((t) => t + 1);
    gsap.fromTo(
      formRef.current,
      { x: 0 },
      { keyframes: { x: [0, -16, 13, -9, 6, -3, 0] }, duration: 0.55, ease: 'power1.out' }
    );
  };

  return (
    <div className="gate" ref={ref}>
      <div className="gate-inner">
        <div className="gate-label">только для тебя</div>
        <div className="stretch">
          <SplitText
            tag="h1"
            text={gate.question}
            className="gate-q"
            effect="rise"
            mask
            splitType="words"
            trigger="load"
            delay={90}
            duration={1.2}
          />
        </div>
        <form className="gate-form" ref={formRef} onSubmit={submit}>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="твой ответ"
            aria-label="Ответ"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          <button ref={btnRef} type="submit" aria-label="Открыть">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          </button>
        </form>
        <p className="gate-msg" aria-live="polite">{msg}</p>
        {tries >= 3 && gate.hint && <p className="gate-hint">{gate.hint}</p>}
      </div>
      <div className="gate-wipe" ref={wipeRef} />
    </div>
  );
}
