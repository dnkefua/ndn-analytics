import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from './blogData';
import { getAllBlogPosts } from '../../lib/blogService';
import type { UnifiedBlogPost } from '../../types/blogPosts';
import SEO from '../seo/SEO';

const BASE_URL = 'https://www.ndnanalytics.com';

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'var(--brand-cyan)',
  Blockchain: 'var(--brand-blue)',
  Industry: 'var(--brand-purple)',
  Product: 'var(--brand-gold)',
  Tools: 'var(--brand-gold)',
};

export default function BlogSection() {
  const [posts, setPosts] = useState<UnifiedBlogPost[]>(
    // Start with static posts for instant render
    BLOG_POSTS.map(p => ({ ...p, source: 'manual' as const }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        const allPosts = await getAllBlogPosts();
        if (mounted) {
          setPosts(allPosts);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        // Keep static posts on error
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <SEO
        title="Blog"
        description="Insights on enterprise AI, blockchain intelligence, demand forecasting, healthcare AI, and supply chain traceability from NDN Analytics."
        keywords="AI blog, blockchain insights, enterprise AI articles, demand forecasting, healthcare AI, supply chain"
        canonicalPath="/blog"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${BASE_URL}/blog`,
            name: 'NDN Analytics Blog',
            url: `${BASE_URL}/blog`,
            inLanguage: 'en-US',
            publisher: {
              '@type': 'Organization',
              name: 'NDN Analytics',
              url: BASE_URL,
            },
            blogPost: sortedPosts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              url: `${BASE_URL}/blog/${post.slug}`,
              datePublished: post.date,
              dateModified: post.date,
              author: {
                '@type': 'Organization',
                name: post.author,
              },
              articleSection: post.category,
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${BASE_URL}/blog#posts`,
            name: 'NDN Analytics Blog Posts',
            itemListElement: sortedPosts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${BASE_URL}/blog/${post.slug}`,
              name: post.title,
            })),
          })}
        </script>
      </Helmet>
      <section className="section" style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
        <div className="container">
          <div className="section-tag">Blog</div>
          <h2 className="section-title" style={{ marginBottom: 48 }}>
            Insights &<br />
            <span className="text-gradient">Intelligence</span>
          </h2>

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: 'var(--text-tertiary)',
              fontFamily: "'JetBrains Mono Variable', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
            }}>
              Loading latest posts...
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {sortedPosts.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`}
                style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 28, textDecoration: 'none', color: 'inherit', transition: 'border-color 0.3s, transform 0.3s', display: 'flex', flexDirection: 'column' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--brand-cyan)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono Variable', monospace", color: CATEGORY_COLORS[post.category] || 'var(--brand-cyan)', background: `${CATEGORY_COLORS[post.category] || 'var(--brand-cyan)'}15`, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono Variable', monospace", color: 'var(--text-tertiary)', padding: '4px 10px' }}>
                    {post.readTime}
                  </span>
                  {post.source === 'ai_generated' && (
                    <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono Variable', monospace", color: 'var(--brand-purple)', background: 'rgba(168,85,247,0.1)', padding: '4px 8px', borderRadius: 20, letterSpacing: '0.05em' }}>
                      AI
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: "'Syne Variable', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'JetBrains Mono Variable', monospace" }}>
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
