import { Link } from 'react-router-dom';
import { PublisherPageLayout, PublisherSection } from './PublisherPageLayout';

export default function CorrectionsPolicy() {
  return (
    <PublisherPageLayout
      label="Publisher Transparency"
      title="Corrections Policy"
      description="How NDN Analytics handles factual corrections, article updates, clarifications, and reader feedback."
      canonicalPath="/corrections-policy"
    >
      <PublisherSection title="Corrections">
        <p>
          If an article contains a factual error, NDN Analytics will review the issue and correct the article when the
          evidence supports a change. Corrections may include updates to wording, figures, dates, source links, or
          technical explanations.
        </p>
      </PublisherSection>

      <PublisherSection title="Updates">
        <p>
          Articles may be updated when new product announcements, research, regulations, or market facts materially
          change the analysis. When an update is significant, the article metadata should reflect the modified date.
        </p>
      </PublisherSection>

      <PublisherSection title="Clarifications">
        <p>
          We may clarify language when a passage is accurate but could be misread. Clarifications are used to improve
          precision, not to change the substance of the article.
        </p>
      </PublisherSection>

      <PublisherSection title="Submit A Correction">
        <p>
          Send correction requests through the
          <Link to="/contact" style={{ color: 'var(--brand-cyan)', marginLeft: 4 }}>contact page</Link>
          {' '}with the article URL, the statement in question, and a supporting source.
        </p>
      </PublisherSection>
    </PublisherPageLayout>
  );
}
