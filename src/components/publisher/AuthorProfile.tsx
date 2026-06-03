import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAuthorBySlug, PUBLISHER } from '../../lib/publisher';
import { PublisherPageLayout, PublisherSection } from './PublisherPageLayout';

export default function AuthorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const author = getAuthorBySlug(slug);

  if (!author) {
    return (
      <PublisherPageLayout
        label="Author"
        title="Author Not Found"
        description="The requested NDN Analytics author profile could not be found."
        canonicalPath="/blog"
      >
        <p style={{ color: 'var(--text-secondary)' }}>Author not found.</p>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </PublisherPageLayout>
    );
  }

  return (
    <PublisherPageLayout
      label="Author"
      title={author.name}
      description={author.description}
      canonicalPath={`/authors/${author.slug}`}
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author.name,
            jobTitle: author.title,
            url: author.url,
            description: author.description,
            worksFor: {
              '@type': 'Organization',
              name: PUBLISHER.name,
              url: PUBLISHER.url,
            },
            sameAs: author.sameAs,
          })}
        </script>
      </Helmet>

      <PublisherSection title="Role">
        <p>{author.title}</p>
      </PublisherSection>

      <PublisherSection title="Coverage Areas">
        <p>
          Enterprise AI strategy, AI agents, blockchain infrastructure, healthcare AI, supply chain intelligence,
          data operations, and applied systems for commercial teams.
        </p>
      </PublisherSection>

      <PublisherSection title="Publisher">
        <p>
          {author.name} publishes through NDN Analytics. Read the
          <Link to="/editorial-policy" style={{ color: 'var(--brand-cyan)', marginLeft: 4 }}>editorial policy</Link>
          {' '}and
          <Link to="/corrections-policy" style={{ color: 'var(--brand-cyan)', marginLeft: 4 }}>corrections policy</Link>
          {' '}for more on how posts are reviewed.
        </p>
      </PublisherSection>
    </PublisherPageLayout>
  );
}
