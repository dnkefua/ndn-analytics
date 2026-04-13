import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.ndnanalytics.com';

interface ArticleSchemaProps {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  datePublished: string;
  image?: string;
  category: string;
}

export default function ArticleSchema({ title, excerpt, slug, author, datePublished, image, category }: ArticleSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NDN Analytics',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
    ...(image && { image }),
    ...(category && { articleSection: category }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
