import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  product?: {
    name: string;
    description: string;
    stack: string;
  };
}

const BASE_URL = 'https://www.ndnanalytics.com';
const DEFAULT_IMAGE = '/favicons.png';

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  type = 'website',
  image = DEFAULT_IMAGE,
  product,
}: SEOProps) {
  const fullTitle = title === 'NDN Analytics' ? title : `${title} | NDN Analytics`;
  const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="NDN Analytics" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@NDNAnalytics" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      {/* JSON-LD Structured Data */}
      {product ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: product.name,
            description: product.description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            provider: {
              '@type': 'Organization',
              name: 'NDN Analytics',
              url: BASE_URL,
            },
          })}
        </script>
      ) : (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'NDN Analytics',
            url: BASE_URL,
            description,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${BASE_URL}/products?search={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          })}
        </script>
      )}
    </Helmet>
  );
}