import { useState } from 'react';
import { mediaUrl } from '../lib/utils';

// Фото/видео в рамке с фиксированным соотношением сторон.
// Если файла нет — заглушка с путём, чтобы раскладка не прыгала.
export default function Media({ src, alt = '', ratio, className = '', video = false, poster, videoRef, fill = false }) {
  const [failed, setFailed] = useState(!src);
  const style = !fill && ratio ? { aspectRatio: ratio } : undefined;

  return (
    <div className={`media ${fill ? 'media-fill' : ''} ${className}`} style={style}>
      {failed ? (
        <div className="media-ph">
          <span>{src || 'фото'}</span>
        </div>
      ) : video ? (
        <video
          ref={videoRef}
          src={mediaUrl(src)}
          poster={mediaUrl(poster)}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          src={mediaUrl(src)}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
