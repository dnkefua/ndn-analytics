const BASE_URL = 'https://www.ndnanalytics.com';

export interface PublisherAuthor {
  name: string;
  slug: string;
  title: string;
  url: string;
  description: string;
  sameAs?: string[];
}

export const PUBLISHER = {
  name: 'NDN Analytics',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.jpg`,
  contactUrl: `${BASE_URL}/contact`,
  editorialPolicyUrl: `${BASE_URL}/editorial-policy`,
  correctionsPolicyUrl: `${BASE_URL}/corrections-policy`,
};

export const AUTHORS: PublisherAuthor[] = [
  {
    name: 'NDN Analytics Team',
    slug: 'ndn-analytics-team',
    title: 'Editorial Team',
    url: `${BASE_URL}/authors/ndn-analytics-team`,
    description:
      'The NDN Analytics editorial team publishes practical analysis on enterprise AI, blockchain systems, healthcare technology, supply chain intelligence, and AI operations.',
    sameAs: ['https://www.linkedin.com/company/ndn-analytics-inc/'],
  },
  {
    name: 'Nkefua Ngassa',
    slug: 'nkefua-ngassa',
    title: 'Founder, NDN Analytics',
    url: `${BASE_URL}/authors/nkefua-ngassa`,
    description:
      'Nkefua Ngassa is the founder of NDN Analytics and leads product strategy across applied AI, blockchain infrastructure, and commercial systems for operational teams.',
    sameAs: ['https://www.linkedin.com/company/ndn-analytics-inc/'],
  },
];

export function getAuthorByName(name?: string): PublisherAuthor {
  return AUTHORS.find((author) => author.name === name) ?? AUTHORS[0];
}

export function getAuthorBySlug(slug?: string): PublisherAuthor | undefined {
  return AUTHORS.find((author) => author.slug === slug);
}

export function formatPublishDate(dateValue: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return `${dateValue}T08:00:00+04:00`;
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? dateValue : parsed.toISOString();
}
