import React from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
}

function buildOptimizedPath(src: string) {
  try {
    // Only transform local absolute paths (start with '/').
    if (!src || typeof src !== 'string') return null;
    if (!src.startsWith('/')) return null;
    const parts = src.split('/');
    const filename = parts[parts.length - 1];
    const name = filename.replace(/\.[^.]+$/, '');
    return `/optimized/${encodeURIComponent(name)}.webp`;
  } catch (e) {
    return null;
  }
}

export default function OptimizedImage({ src, alt, srcSet, sizes, ...rest }: Props) {
  const optimized = buildOptimizedPath(src);

  return (
    <picture>
      {optimized && <source srcSet={optimized} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading={rest.loading ?? 'lazy'}
        decoding={rest.decoding ?? 'async'}
        fetchPriority={rest.fetchPriority}
        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        {...rest}
      />
    </picture>
  );
}
