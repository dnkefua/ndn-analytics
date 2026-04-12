import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BLOG_POSTS } from './blogData';
import { getBlogPostBySlug } from '../../lib/blogService';
import type { UnifiedBlogPost } from '../../types/blogPosts';
import BlogSidebar from './BlogSidebar';
import ServiceCTA from './ServiceCTA';
import SEO from '../seo/SEO';
import OptimizedImage from '../ui/OptimizedImage';
import ExitIntentProvider from '../leadgen/ExitIntentProvider';
import ContentUpgradeModal from '../leadgen/ContentUpgradeModal';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<UnifiedBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        setLoading(false);
        return;
      }

      // Try static posts first (faster)
      const staticPost = BLOG_POSTS.find(p => p.slug === slug);
      if (staticPost) {
        setPost({ ...staticPost, source: 'manual' });
        setLoading(false);
        return;
      }

      // Try dynamic posts from Firestore
      const dynamicPost = await getBlogPostBySlug(slug);
      setPost(dynamicPost);
      setLoading(false);
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-tertiary)' }}>Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <SEO title="Post Not Found" description="The blog post you're looking for doesn't exist." canonicalPath="/blog" />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <p style={{ color: 'var(--text-secondary)' }}>Post not found.</p>
          <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
        </div>
      </>
    );
  }

  const renderInline = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, j) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return <a key={j} href={match[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED', textDecoration: 'underline' }}>{match[1]}</a>;
      }
      return part;
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: "'Syne Variable', sans-serif", fontSize: '1.5rem', fontWeight: 700, marginTop: 40, marginBottom: 16, color: 'var(--text-primary)' }}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('- **')) {
        const parts = line.replace('- **', '').split('**: ');
        return <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.7 }}><strong style={{ color: 'var(--text-primary)' }}>{parts[0]}</strong>{parts[1] ? `: ${renderInline(parts[1])}` : ''}</li>;
      }
      if (line.startsWith('- ')) return <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.7 }}>{renderInline(line.replace('- ', ''))}</li>;
      if (/^\d+\.\s/.test(line)) return <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.7, listStyle: 'decimal', marginLeft: 20 }}>{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>{renderInline(line)}</p>;
    });
  };

  return (
    <ExitIntentProvider enabled={Boolean(post.contentUpgrade)} scrollThreshold={0.5}>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category.toLowerCase()}, ${post.title.toLowerCase()}`}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        author={post.author}
        datePublished={post.date}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <article style={{ paddingTop: 120, paddingBottom: 80, minHeight: '100vh' }}>
        <div className="container">
          <Link to="/blog" style={{ display: 'inline-block', marginBottom: 32, color: '#7C3AED', textDecoration: 'none', fontFamily: "'JetBrains Mono Variable', monospace", fontSize: '0.8rem', letterSpacing: '0.05em' }}>← Back to Blog</Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }} className="blog-layout">
            {/* Main Content */}
            <div style={{ maxWidth: 760 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono Variable', monospace", color: '#7C3AED', background: 'rgba(124,58,237,0.1)', padding: '4px 10px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{post.category}</span>
                <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono Variable', monospace", color: 'var(--text-tertiary)', padding: '4px 10px' }}>{post.readTime}</span>
              </div>
              <h1 style={{ fontFamily: "'Syne Variable', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 24, color: 'var(--text-primary)' }}>{post.title}</h1>
              {post.image && (
                <div style={{ marginBottom: 28 }}>
                  <OptimizedImage src={post.image} alt={post.title} sizes="(max-width: 760px) 100vw, 760px" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 24, marginBottom: 40, fontSize: '0.85rem', color: 'var(--text-tertiary)', fontFamily: "'JetBrains Mono Variable', monospace" }}>
                <span>{post.author}</span>
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 32 }}>
                {renderContent(post.content)}
              </div>

              {/* NDN Analytics Service CTA */}
              <ServiceCTA
                serviceCTA={post.ndnServiceCTA}
                relatedProducts={post.relatedProducts}
                source={post.source === 'ai_generated' ? 'ai_generated' : 'manual'}
              />
            </div>

            {/* Sidebar */}
            <BlogSidebar post={post} />
          </div>
        </div>
        <style>{`
          @media (min-width: 1024px) {
            .blog-layout {
              grid-template-columns: 1fr 320px !important;
            }
          }
        `}</style>
      </article>

      {post.contentUpgrade && (
        <ContentUpgradeModal
          title={post.contentUpgrade.title}
          description={post.contentUpgrade.description}
          downloadId={post.contentUpgrade.downloadId}
          productInterests={post.relatedProducts}
        />
      )}
    </ExitIntentProvider>
  );
}
