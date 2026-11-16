import { useState } from 'react';

export default function ProductImage({ src, title, priority = false }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className="image-placeholder" role="img" aria-label={`${title}: image unavailable`}>Image unavailable</div>;
  }
  return <img src={src} alt={title} width="400" height="400"
    loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
    decoding="async" onError={() => setFailed(true)} />;
}
