import ChapterTitle from './blocks/ChapterTitle';
import TextBlock from './blocks/TextBlock';
import PhotoScatter from './blocks/PhotoScatter';
import PhotoHero from './blocks/PhotoHero';
import PhotoStrip from './blocks/PhotoStrip';
import PhotoCollage from './blocks/PhotoCollage';
import PhotoGrid from './blocks/PhotoGrid';
import VideoBlock from './blocks/VideoBlock';
import VideoCircles from './blocks/VideoCircles';
import Counter from './blocks/Counter';
import Letter from './blocks/Letter';
import Marquee from './blocks/Marquee';
import AchievementMarker from './blocks/AchievementMarker';
import Trophies from './blocks/Trophies';
import Place from './blocks/Place';

const PHOTOS = { scatter: PhotoScatter, hero: PhotoHero, strip: PhotoStrip, collage: PhotoCollage, grid: PhotoGrid };

const BLOCKS = {
  chapter: ChapterTitle,
  text: TextBlock,
  video: VideoBlock,
  circles: VideoCircles,
  counter: Counter,
  letter: Letter,
  marquee: Marquee,
  achievement: AchievementMarker,
  trophies: Trophies,
  place: Place,
  spacer: ({ block }) => <div className={`spacer sz-${block.size || 'm'}`} />,
};

export default function StoryRenderer({ story, config }) {
  let chapter = -1;
  return story.map((block, i) => {
    if (block.type === 'chapter') chapter += 1;
    const Block = block.type === 'photos' ? PHOTOS[block.layout] || PhotoScatter : BLOCKS[block.type];
    if (!Block) {
      console.warn(`Неизвестный тип блока: ${block.type}`);
      return null;
    }
    return <Block key={i} block={block} index={chapter} story={story} config={config} />;
  });
}
