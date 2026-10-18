import SplitText from '../SplitText';
import { longestWord } from '../../lib/utils';

const DEFAULTS = {
  grotesk: { effect: 'rise', mask: true, splitType: 'words', delay: 70, duration: 1.2 },
  hand: { effect: 'blur', splitType: 'words', delay: 80, duration: 1.4 },
  body: { effect: 'fade', splitType: 'words', delay: 18, duration: 0.9 },
};

export default function TextBlock({ block }) {
  const { text, font = 'grotesk', size = 'm', align = 'center', effect, hover, staggerFrom = 'start' } = block;
  const d = DEFAULTS[font] || DEFAULTS.grotesk;
  const chars = font === 'grotesk' && size === 'xl';
  const paragraphs = Array.isArray(text) ? text : [text];

  return (
    <section className={`text-block t-${font} s-${size} a-${align}`}>
      {paragraphs.map((p, i) => (
        <div key={i} className={font === 'grotesk' && (size === 'l' || size === 'xl') ? 'stretch' : 'plain'} style={{ '--len': longestWord(p) }}>
        <SplitText
          tag={size === 'xl' || size === 'l' ? 'h3' : 'p'}
          text={p}
          className="text-split"
          effect={effect || d.effect}
          mask={!effect && d.mask}
          splitType={block.splitType || (chars ? 'chars' : d.splitType)}
          delay={chars ? 40 : d.delay}
          duration={d.duration}
          staggerFrom={staggerFrom}
          hoverEffect={hover ? 'lift' : 'none'}
          textAlign={align}
        />
        </div>
      ))}
    </section>
  );
}
