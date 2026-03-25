import { Helmet } from 'react-helmet-async';

// Organization Schema - Add to homepage only
export default function OrganizationSchema() {
  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NDN Analytics',
    url: 'https://www.ndnanalytics.com',
    logo: 'https://www.ndnanalytics.com/favicon.svg',
    description: 'Enterprise AI & Blockchain Intelligence Platform. Google Cloud AI meets Ethereum.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'nkefua@ndnanalytics.com',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/NDNAnalytics',
      'https://www.linkedin.com/company/ndnanalytics',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Blockchain',
      'Ethereum',
      'Google Cloud',
      'Enterprise Software',
      'Demand Forecasting',
      'Supply Chain',
      'Healthcare AI',
      'Smart Contracts',
    ],
    areaServed: 'Worldwide',
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(orgData)}
      </script>
    </Helmet>
  );
}