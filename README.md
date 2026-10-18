# Наша история

Сайт-подарок: Vite + React + GSAP (SplitText, ScrollTrigger) + Lenis.

## Запуск
```
npm install
npm run dev        # http://localhost:5173  (с телефона в той же Wi-Fi — адрес Network из консоли)
npm run build      # готовый сайт в dist/
```

## Где что менять
- **Весь контент** — `src/data/story.js` (главы, тексты, фото, достижения, письмо, дата начала).
- **Фото/видео** — `public/media/<папка>/...`, в story.js путь пишется от `media/`.
- **Пароль** — `npm run hash -- "ответ"` → вставить результат в `config.gate.answerHash`.
- Сбросить «уже открыто» и снова увидеть экран пароля — открыть сайт с `?lock` в адресе.
