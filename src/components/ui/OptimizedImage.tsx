import React from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
}

export default function OptimizedImage({ src, alt, srcSet, sizes, ...rest }: Props) {
  return (
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
  );
}
