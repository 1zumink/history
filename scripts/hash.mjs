// Использование: npm run hash -- "ответ"
// Печатает хэш, который нужно вставить в config.gate.answerHash (src/data/story.js)
import { hash, normalize } from '../src/lib/gate.js';

const answer = process.argv.slice(2).join(' ');
if (!answer) {
  console.log('Использование: npm run hash -- "ответ"');
  process.exit(1);
}
console.log(`Ответ после нормализации: ${normalize(answer)}`);
console.log(`answerHash: '${hash(normalize(answer))}'`);
