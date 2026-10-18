/*
  ВЕСЬ КОНТЕНТ САЙТА ЖИВЁТ ЗДЕСЬ.

  Фото и видео лежат в public/media/<папка>/01.jpg, 02.jpg…
  Хелпер shots('папка', [номера], [размеры]) собирает фото с правильными пропорциями.
  Если файла нет, на его месте будет серая заглушка с путём.

  ТИПЫ БЛОКОВ
  ─────────────────────────────────────────────────────────────────────────────
  chapter      { title, date?, place?, subtitle?, align?: 'left'|'right'|'center', ghost?: true }
  place        { title, date? }          — локация внутри главы
  text         { text: 'строка' | ['абзац', 'абзац'], font: 'grotesk'|'hand'|'body',
                 size: 's'|'m'|'l'|'xl', align: 'left'|'center'|'right',
                 effect?: 'rise'|'fade'|'blur'|'flip'|'pop'|'skew'|'wave', hover?: true }
  photos       { layout: 'scatter'|'hero'|'strip'|'collage'|'grid', items: [...], title?, subtitle?, text?, cols? }
                 item: { src, size?: 's'|'m'|'l'|'xl', ratio?: '4/5', caption?, rotate? }
                 в scatter вместо фото можно вставить записку: { note: 'текст' }
  video        { src, poster?, ratio?: '16/9'|'9/16', size?: 'm'|'l'|'xl', caption? }
  circles      { items: ['путь.mp4', 'путь.mp4'] } — телеграм-кружки рядом
  achievement  { icon, title, desc? }    — всплывает плашкой, когда доскроллили
  marquee      { text, dark?: true, reverse?: true }
  counter      { label? }                — «вместе N дней», дата из config.startDate
  trophies     {}                        — все достижения, собранные по пути
  letter       { title?, paragraphs: [...], signature }
  spacer       { size?: 's'|'m'|'l' }
*/

import ratios from './media.json';

const pad = (n) => String(n).padStart(2, '0');
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// shots('01-znakomstvo', [1, 2, 3], ['l', 's', 'm']) → фото с пропорциями из media.json
const shots = (folder, nums, sizes = []) =>
  nums.map((n, i) => {
    const src = `${folder}/${pad(n)}.jpg`;
    return { src, ratio: ratios[src], size: sizes[i % (sizes.length || 1)] };
  });

const SCATTER_P = ['l', 's', 'm', 's', 'm', 'l', 's', 'm'];
const SCATTER_L = ['xl', 'm', 'l', 's', 'l', 'm'];
const STRIP = ['l', 'm', 's', 'l', 'm', 's'];

export const config = {
  title: 'Наша история',
  names: 'Илья & Аня',
  // Начало отношений — от неё считается счётчик «вместе N дней»
  startDate: '2026-07-03T00:00:00',

  gate: {
    question: 'Когда мы начали встречаться?',
    // хэш ответа: npm run hash -- "ответ". Можно несколько: ['хэш1', 'хэш2']
    // «3 июля», «3 июля 2026», «03.07», «3.07», «03.07.2026», «3.07.2026», «третьего июля»
    answerHash: ['14f8b4c636cc6d', '137a7271b9a218', '873969f30aaff', '1db814d525b689', '4df6837bd4e97', '175203c5ef1e1a', '1c5de55045467e'],
    hint: 'Подсказка: лето 2026',
  },

  // Маленькие фото вокруг заголовка на первом экране (0–4 шт.)
  introPhotos: [],
};

const P = '06-piter';

export const story = [
  // ───────────────────────────── 01 ЗНАКОМСТВО ─────────────────────────────
  {
    type: 'chapter',
    title: 'Знакомство',
    date: '18 июня 2026',
    place: 'Котлы',
    subtitle: 'Пришла какая-то рандомная девочка, обблевала мне штаны и я влюбился. И все это под дронами.',
  },
  { type: 'photos', layout: 'scatter', items: shots('01-znakomstvo', range(1, 5), SCATTER_P) },

  // ───────────────────────────── 02 ПЕРВОЕ СВИДАНИЕ ─────────────────────────────
  {
    type: 'chapter',
    title: 'Первое свидание',
    date: '27 июня',
    place: 'ВДНХ',
    subtitle: 'Еще тогда я понял, что ну просто по уши в тебя влюбился',
  },
  { type: 'photos', layout: 'collage', items: shots('02-svidanie-1', [3, 1, 2]) },

  // ───────────────────────────── 03 ВТОРОЕ СВИДАНИЕ ─────────────────────────────
  {
    type: 'chapter',
    title: 'Второе свидание',
    date: '2 июля',
    place: 'Ледовая арена «Морозово»',
    subtitle: 'А здесь влюбился еще больше',
  },
  { type: 'circles', items: ['03-svidanie-2/circle-1.mp4', '03-svidanie-2/circle-2.mp4'] },
  { type: 'video', src: '03-svidanie-2/video-1.mp4', ratio: '9/16', size: 'm' },

  // ───────────────────────────── 04 ТРЕТЬЕ СВИДАНИЕ ─────────────────────────────
  {
    type: 'chapter',
    title: 'Третье свидание',
    date: '3 июля',
    place: 'Карьер в Котлах',
    subtitle: 'А здесь мы устроили пикник',
  },
  { type: 'photos', layout: 'scatter', items: shots('04-svidanie-3', range(1, 7), SCATTER_L) },

  // ───────────────────────────── 05 БУДНИ ─────────────────────────────
  { type: 'chapter', title: 'Будни', subtitle: 'куча прекрасных дней' },
  { type: 'photos', layout: 'grid', cols: 6, items: shots('05-do-pitera', [1, 2, 3, 4, 5, 12, 6, 7, 8, 9, 10, 11]) },

  // ───────────────────────────── IT-ПИКНИК ─────────────────────────────
  { type: 'chapter', title: 'IT-пикник', date: '9 августа', place: 'Парк Коломенское', subtitle: 'от Т-Банка' },
  { type: 'photos', layout: 'hero', items: shots('05b-piknik', [12]) },
  { type: 'photos', layout: 'scatter', items: shots('05b-piknik', [1, 4, 6, 7, 14, 13, 10, 16], SCATTER_L) },
  { type: 'photos', layout: 'strip', items: shots('05b-piknik', [2, 3, 5, 8, 9, 11, 15], STRIP) },

  // ───────────────────────────── 06 ПИТЕР ─────────────────────────────
  {
    type: 'chapter',
    title: 'Питер',
    date: '26–30 августа',
    place: 'Санкт-Петербург',
    subtitle: 'Наша первая совместная поездка',
  },
  { type: 'photos', layout: 'scatter', items: shots(`${P}/1-nachalo`, range(1, 6), SCATTER_L) },

  { type: 'place', title: 'Лофт проект «Этажи»', date: '26 августа' },
  { type: 'photos', layout: 'collage', items: shots(`${P}/6-etazhi`, [3, 1, 2]) },
  { type: 'photos', layout: 'scatter', items: shots(`${P}/6-etazhi`, [4, 5, 6], ['m', 'l', 's']) },

  { type: 'place', title: 'Гик трип', date: '26 августа' },
  { type: 'photos', layout: 'strip', items: shots(`${P}/5-gik-trip`, range(1, 9), STRIP) },

  { type: 'place', title: 'Krang пицца', date: '26 августа' },
  { type: 'photos', layout: 'collage', items: shots(`${P}/4-krang`, [6, 1, 2]) },
  { type: 'photos', layout: 'scatter', items: shots(`${P}/4-krang`, [3, 4, 5, 7, 8, 9, 10, 11, 12], SCATTER_P) },

  { type: 'place', title: 'Исаакиевский собор', date: '26 августа' },
  { type: 'photos', layout: 'hero', items: shots(`${P}/3-isaakievskiy`, [1]) },
  { type: 'photos', layout: 'scatter', items: shots(`${P}/3-isaakievskiy`, range(2, 10), SCATTER_P) },

  { type: 'place', title: 'Адмиралтейство', date: '26 августа' },
  { type: 'photos', layout: 'strip', items: shots(`${P}/2-kolonna`, range(1, 5), STRIP) },

  { type: 'place', title: 'Севкабель', date: '28 августа' },
  { type: 'video', src: `${P}/7-sevkabel/video-1.mp4`, ratio: '16/9', size: 'l' },
  { type: 'photos', layout: 'scatter', items: shots(`${P}/7-sevkabel`, [1, 2, 3, 5, 4, 6, 7, 11], SCATTER_P) },
  { type: 'video', src: `${P}/7-sevkabel/video-4.mp4`, ratio: '9/16', size: 'm' },
  { type: 'photos', layout: 'strip', items: shots(`${P}/7-sevkabel`, [8, 9, 10, 12, 13, 14, 15, 16], STRIP) },
  { type: 'video', src: `${P}/7-sevkabel/video-2.mp4`, ratio: '16/9', size: 'm' },
  { type: 'video', src: `${P}/7-sevkabel/video-3.mp4`, ratio: '16/9', size: 'm' },
  { type: 'video', src: `${P}/7-sevkabel/video-5.mp4`, ratio: '9/16', size: 'm' },

  { type: 'photos', layout: 'scatter', items: shots(`${P}/8-konec`, range(1, 3), ['m', 'l', 'm']) },
  { type: 'marquee', text: 'питер', dark: true },

  // ───────────────────────────── 07 БИЛЬЯРД ─────────────────────────────
  { type: 'chapter', title: 'Бильярд', date: '17 сентября', place: 'Бобсон', subtitle: 'покатали шары )))' },
  { type: 'photos', layout: 'scatter', items: shots('07-bilyard', range(1, 8), SCATTER_P) },
  { type: 'video', src: '07-bilyard/video-1.mp4', ratio: '9/16', size: 'm' },
  { type: 'photos', layout: 'strip', items: shots('07-bilyard', range(9, 14), STRIP) },

  // ───────────────────────────── 08 ДР ─────────────────────────────
  {
    type: 'chapter',
    title: 'Отпраздновали мой ДР',
    date: '25–26 сентября',
    place: 'Котлы',
    subtitle: 'Красивые фотки с поцелуями',
  },
  { type: 'photos', layout: 'hero', items: shots('08-dr', [1]) },
  { type: 'photos', layout: 'strip', items: shots('08-dr', range(2, 13), STRIP) },
  { type: 'photos', layout: 'scatter', items: shots('08-dr', range(14, 23), SCATTER_P) },

  // ───────────────────────────── 09 ХОРРОР-КВЕСТ ─────────────────────────────
  {
    type: 'chapter',
    title: 'Хоррор-квест',
    date: '3 октября',
    place: 'Кладбище домашних животных',
    subtitle: 'Моя девушка самая бесстрашная',
  },
  { type: 'photos', layout: 'collage', items: shots('09-kvest', [1, 2]) },

  // ───────────────────────────── НАСТОЕШНАЯ? ─────────────────────────────
  { type: 'chapter', title: 'Настоешная?', ghost: true, align: 'center' },

  // ───────────────────────────── ФИНАЛ ─────────────────────────────
  { type: 'marquee', text: 'люблю тебя', reverse: true },
  {
    type: 'letter',
    title: 'Письмо тебе',
    paragraphs: ['С каждым днем я влюбляюсь в тебя все больше и больше, у нас все обязательно получится!!'],
    signature: 'Люблю',
  },
  { type: 'spacer', size: 'm' },
  { type: 'text', font: 'grotesk', size: 'xl', align: 'center', text: 'Продолжение следует', effect: 'flip' },
  { type: 'spacer', size: 'l' },
];
