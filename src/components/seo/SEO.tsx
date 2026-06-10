import { Helmet } from 'react-helmet-async';
import { formatPublishDate, getAuthorByName, PUBLISHER } from '../../lib/publisher';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'product';
  /** Schema.org type for article pages. Defaults to BlogPosting (correct for
   *  evergreen how-to/analysis posts). Set to 'NewsArticle' only for genuinely
   *  timely, datelined news. */
  articleType?: 'BlogPosting' | 'NewsArticle';
  image?: string;
  product?: {
    name: string;
    description: string;
    stack: string;
  };
  author?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: Array<{
    name: string;
    path: string;
  }>;
}

const BASE_URL = 'https://www.ndnanalytics.com';
const DEFAULT_IMAGE = '/og-image.png';

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  type = 'website',
  articleType = 'BlogPosting',
  image = DEFAULT_IMAGE,
  product,
  author,
  datePublished,
  dateModified,
  breadcrumbs,
}: SEOProps) {
  const fullTitle = title === 'NDN Analytics' ? title : `${title} | NDN Analytics`;
  const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : BASE_URL;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const effectiveDatePublished = datePublished ? formatPublishDate(datePublished) : new Date().toISOString();
  const effectiveDateModified = dateModified ? formatPublishDate(dateModified) : effectiveDatePublished;
  const articleAuthor = getAuthorByName(author);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author || 'NDN Analytics'} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" type="application/rss+xml" title="NDN Analytics Blog Feed" href={`${BASE_URL}/feed.xml`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="NDN Analytics" />
      <meta property="og:locale" content="en_US" />
      {type === 'article' && <meta property="article:published_time" content={effectiveDatePublished} />}
      {type === 'article' && <meta property="article:modified_time" content={effectiveDateModified} />}
      {type === 'article' && <meta property="article:author" content={articleAuthor.url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@NDNAnalytics" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* JSON-LD Structured Data */}
      {type === 'article' ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': articleType,
            '@id': canonicalUrl,
            headline: title,
            description,
            image: [imageUrl],
            datePublished: effectiveDatePublished,
            dateModified: effectiveDateModified,
            author: {
              '@type': 'Person',
              name: articleAuthor.name,
              url: articleAuthor.url,
              description: articleAuthor.description,
            },
            publisher: {
              '@type': 'Organization',
              name: PUBLISHER.name,
              url: PUBLISHER.url,
              logo: { '@type': 'ImageObject', url: PUBLISHER.logo },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
          })}
        </script>
      ) : product ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            '@id': canonicalUrl,
            name: product.name,
            description: product.description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/Inquire',
            },
            provider: {
              '@type': 'Organization',
              '@id': BASE_URL,
              name: 'NDN Analytics',
              url: BASE_URL,
            },
            image: imageUrl,
            url: canonicalUrl,
          })}
        </script>
      ) : (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': BASE_URL,
            name: 'NDN Analytics',
            url: BASE_URL,
            description,
            image: imageUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${BASE_URL}/products?search={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              '@id': BASE_URL,
              name: 'NDN Analytics',
            },
          })}
        </script>
      )}

      {/* BreadcrumbList Schema */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: crumb.name,
              item: `${BASE_URL}${crumb.path}`,
            })),
          })}
        </script>
      )}
    </Helmet>
  );
}
