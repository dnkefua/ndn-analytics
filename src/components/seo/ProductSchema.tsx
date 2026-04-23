import { Helmet } from 'react-helmet-async';
import type { Product } from '../../types';

const BASE_URL = 'https://www.ndnanalytics.com';

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    url: `${BASE_URL}/products/${product.id}`,
    applicationCategory: product.stack === 'ethereum' ? 'BlockchainApplication' : 'BusinessApplication',
    operatingSystem: 'Cloud',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Contact for custom enterprise pricing',
      url: `${BASE_URL}/pricing`,
    },
    provider: {
      '@type': 'Organization',
      name: 'NDN Analytics',
      url: BASE_URL,
    },
    ...(product.media?.image && {
      image: product.media.image.startsWith('http')
        ? product.media.image
        : `${BASE_URL}${product.media.image}`,
    }),
    featureList: product.features.join(', '),
    ...(product.industries && {
      audience: {
        '@type': 'Audience',
        audienceType: product.industries.join(', '),
      },
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
