import { Helmet } from 'react-helmet-async';

// ContactPage Schema - Add to contact page
export default function ContactPageSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact NDN Analytics',
    description: 'Get in touch with NDN Analytics for enterprise AI and blockchain intelligence solutions.',
    url: 'https://www.ndnanalytics.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'NDN Analytics',
      url: 'https://www.ndnanalytics.com',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'nkefua@ndnanalytics.com',
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ndnanalytics.com/' },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.ndnanalytics.com/contact' },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
