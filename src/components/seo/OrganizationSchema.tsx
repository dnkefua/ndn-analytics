import { Helmet } from 'react-helmet-async';

// Enhanced Organization Schema for GEO and SEO optimization
// Add to homepage only
export default function OrganizationSchema() {
  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.ndnanalytics.com/#organization',
    name: 'NDN Analytics',
    url: 'https://www.ndnanalytics.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.ndnanalytics.com/favicon.svg',
      width: 512,
      height: 512,
    },
    description: 'NDN Analytics builds AI products and delivers enterprise AI services on Google Cloud Platform. Our blockchain solutions on Ethereum bring transparency, security, and speed to enterprise operations. We specialize in AI-powered demand forecasting, supply chain traceability, smart contract automation, and healthcare AI solutions.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5406 E 23rd St',
      addressLocality: 'Tulsa',
      addressRegion: 'Oklahoma',
      postalCode: '74114',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'contact@ndnanalytics.com',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
    sameAs: [
      'https://www.linkedin.com/company/ndn-analytics-inc/',
      // Add YouTube once created: 'https://www.youtube.com/@NDNAnalytics',
      // Add Twitter once created: 'https://twitter.com/NDNAnalytics',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Blockchain',
      'Ethereum',
      'Smart Contracts',
      'DeFi',
      'Google Cloud Platform',
      'Vertex AI',
      'BigQuery',
      'Enterprise Software',
      'Demand Forecasting',
      'Inventory Optimization',
      'Supply Chain Management',
      'Healthcare AI',
      'Patient Readmission Prevention',
      'Clinical Decision Support',
      'B2B Payments',
      'Payment Automation',
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    serviceType: [
      'AI Product Development',
      'Enterprise AI Services',
      'Blockchain Development',
      'Smart Contract Development',
      'Supply Chain Solutions',
      'Healthcare Technology',
      'Cloud Consulting',
      'Machine Learning Implementation',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'NDN Analytics Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'NDN Demand IQ',
            applicationCategory: 'BusinessApplication',
            description: 'AI-powered demand forecasting and inventory optimization for retail and supply chain',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'NDN TraceChain',
            applicationCategory: 'BusinessApplication',
            description: 'Supply chain traceability and provenance tracking on Ethereum blockchain',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'NDN PayStream',
            applicationCategory: 'BusinessApplication',
            description: 'Automated B2B payment processing with smart contract escrow',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'SoftwareApplication',
            name: 'NDN HealthPredict',
            applicationCategory: 'HealthApplication',
            description: 'Healthcare AI for patient readmission prevention and clinical decision support',
          },
        },
      ],
    },
    award: [
      '45% Stockout Reduction - Regional Grocery Chain Case Study',
      '100% FDA Compliance - Pharmaceutical Distributor',
      '$4.2M Annual Cost Savings - Client Achievements',
    ],
    founder: {
      '@type': 'Person',
      name: 'Nkefua Desmond',
      url: 'https://www.linkedin.com/in/desmond-nkefua-data-analyst/?skipRedirect=true',
      jobTitle: 'Founder & CEO',
      birthPlace: {
        '@type': 'Place',
        name: 'Cameroon',
      },
      alumniOf: [
        {
          '@type': 'EducationalOrganization',
          name: 'East Central University',
          location: {
            '@type': 'Place',
            name: 'Ada, Oklahoma, United States',
          },
          degree: 'Masters',
        },
      ],
      workLocation: [
        {
          '@type': 'Place',
          name: 'United States',
        },
        {
          '@type': 'Place',
          name: 'Canada',
        },
        {
          '@type': 'Place',
          name: 'Dubai, United Arab Emirates',
        },
      ],
    },
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Enterprise AI and Blockchain Solutions',
        description: 'End-to-end AI product development and blockchain implementation services',
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(orgData)}
      </script>
    </Helmet>
  );
}
