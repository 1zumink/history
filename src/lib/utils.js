// Путь к файлу из public/media. Полные URL и абсолютные пути не трогаем.
export const mediaUrl = (src) =>
  !src || /^(https?:)?\/\//.test(src) || src.startsWith('/')
    ? src
    : `${import.meta.env.BASE_URL}media/${src}`;

// plural(5, ['день', 'дня', 'дней']) → 'дней'
export function plural(n, [one, few, many]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

// '3/4' → 0.75
export const ratioNumber = (ratio, fallback = 1) => {
  if (!ratio) return fallback;
  const [w, h] = String(ratio).split('/').map(Number);
  return h ? w / h : w || fallback;
};

export const MQ = {
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  reduce: '(prefers-reduced-motion: reduce)',
};

// Длина самого длинного слова — по ней ужимаем огромные заголовки, чтобы слово не вылезало за экран
export const longestWord = (text = '') => Math.max(1, ...String(text).split(/\s+/).map((w) => w.length));
