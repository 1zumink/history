// Нормализация ответа: регистр, ё/е, пробелы и знаки препинания не важны.
// «12.05.2024», «12 05 2024» и «12052024» считаются одним ответом.
export const normalize = (s) =>
  String(s)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[\s.,:;!?'"«»()\-–—/\\]+/g, '');

// cyrb53: простой хэш, чтобы ответ не лежал в коде открытым текстом.
// Это защита «от случайного взгляда», а не настоящая безопасность.
export function hash(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

const hashes = (answerHash) => (Array.isArray(answerHash) ? answerHash : [answerHash]);

export const checkAnswer = (input, answerHash) => hashes(answerHash).includes(hash(normalize(input)));

const KEY = 'our-story-unlocked';

export function isUnlocked(answerHash) {
  try {
    if (new URLSearchParams(window.location.search).has('lock')) {
      localStorage.removeItem(KEY);
      return false;
    }
    return localStorage.getItem(KEY) === hashes(answerHash).join(',');
  } catch {
    return false;
  }
}

export function rememberUnlock(answerHash) {
  try {
    localStorage.setItem(KEY, hashes(answerHash).join(','));
  } catch {
    /* приватный режим — просто спросим ещё раз */
  }
}
