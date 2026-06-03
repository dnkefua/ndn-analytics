import { Helmet } from 'react-helmet-async';
import { formatPublishDate, getAuthorByName, PUBLISHER } from '../../lib/publisher';

const BASE_URL = 'https://www.ndnanalytics.com';

interface ArticleSchemaProps {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  category: string;
  keywords?: string[];
}

export default function ArticleSchema({
  title,
  excerpt,
  slug,
  author,
  datePublished,
  dateModified,
  image,
  category,
  keywords = [],
}: ArticleSchemaProps) {
  const url = `${BASE_URL}/blog/${slug}`;
  const ogImage = image
    ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
    : `${BASE_URL}/og-image.png`;
  const articleAuthor = getAuthorByName(author);
  const publishedAt = formatPublishDate(datePublished);
  const modifiedAt = dateModified ? formatPublishDate(dateModified) : publishedAt;

  const data = {
    '@context': 'https://schema.org',
    '@type': ['NewsArticle', 'BlogPosting'],
    headline: title,
    description: excerpt,
    url,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: articleAuthor.name,
      url: articleAuthor.url,
      description: articleAuthor.description,
      sameAs: articleAuthor.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER.logo,
        width: 512,
        height: 512,
      },
    },
    image: {
      '@type': 'ImageObject',
      url: ogImage,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${BASE_URL}/blog`,
      name: 'NDN Analytics Blog',
      publisher: {
        '@type': 'Organization',
        name: 'NDN Analytics',
        url: BASE_URL,
      },
    },
    articleSection: category,
    ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
