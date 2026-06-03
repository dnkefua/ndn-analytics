import { Link } from 'react-router-dom';
import { PublisherPageLayout, PublisherSection } from './PublisherPageLayout';

export default function EditorialPolicy() {
  return (
    <PublisherPageLayout
      label="Publisher Transparency"
      title="Editorial Policy"
      description="How NDN Analytics researches, reviews, and publishes analysis on enterprise AI, blockchain, data infrastructure, healthcare technology, and operational systems."
      canonicalPath="/editorial-policy"
    >
      <PublisherSection title="Editorial Mission">
        <p>
          NDN Analytics publishes practical intelligence for operators, founders, executives, and technical teams
          evaluating AI and blockchain systems. Our editorial work is designed to explain what changed, why it matters,
          what evidence supports it, and what a serious organization should do next.
        </p>
      </PublisherSection>

      <PublisherSection title="Research Standards">
        <p>
          Articles are built from primary sources where possible, including official product announcements, technical
          documentation, public policy material, research papers, standards bodies, and reputable market reports. When
          an article includes interpretation, forecast, or NDN Analytics product perspective, we aim to separate that
          analysis from factual reporting.
        </p>
      </PublisherSection>

      <PublisherSection title="Review Process">
        <p>
          Posts are checked for technical accuracy, date accuracy, source quality, and commercial clarity before
          publication. Scheduled articles are held from public sitemaps, RSS, and direct article rendering until their
          publish date arrives.
        </p>
      </PublisherSection>

      <PublisherSection title="Commercial Disclosure">
        <p>
          NDN Analytics builds and sells AI and blockchain products. Some articles may discuss NDN products when they
          are relevant to the topic. Product calls to action are editorially separated from the analysis so readers can
          evaluate the article on its own merits.
        </p>
      </PublisherSection>

      <PublisherSection title="Contact">
        <p>
          For editorial questions, source corrections, or publication requests, contact NDN Analytics through the
          <Link to="/contact" style={{ color: 'var(--brand-cyan)', marginLeft: 4 }}>contact page</Link>.
        </p>
      </PublisherSection>
    </PublisherPageLayout>
  );
}
