export const whitepaperContent = `
<!-- BACKGROUND -->
<div class="bg-canvas"></div>
<div class="bg-grid"></div>

<!-- TABLE OF CONTENTS -->
<nav class="toc" aria-label="Page contents">
  <a href="#hero" class="toc-item active"><span class="toc-dot"></span>Overview</a>
  <a href="#problem" class="toc-item"><span class="toc-dot"></span>Problem</a>
  <a href="#thesis" class="toc-item"><span class="toc-dot"></span>Thesis</a>
  <a href="#architecture" class="toc-item"><span class="toc-dot"></span>Architecture</a>
  <a href="#data-planes" class="toc-item"><span class="toc-dot"></span>Data Planes</a>
  <a href="#competitive" class="toc-item"><span class="toc-dot"></span>Competitive</a>
  <a href="#why-now" class="toc-item"><span class="toc-dot"></span>Why Now</a>
  <a href="#status" class="toc-item"><span class="toc-dot"></span>Status</a>
  <a href="#roadmap" class="toc-item"><span class="toc-dot"></span>Roadmap</a>
  <a href="#security" class="toc-item"><span class="toc-dot"></span>Security</a>
  <a href="#governance" class="toc-item"><span class="toc-dot"></span>Governance</a>
  <a href="#references" class="toc-item"><span class="toc-dot"></span>References</a>
</nav>

<!-- NAVIGATION -->
<nav>
  <div class="nav-inner">
    <a href="#hero" class="nav-brand">
      <div class="nav-logo">NDN</div>
      <span class="nav-name">IPFS Chain</span>
    </a>
    <ul class="nav-links">
      <li><a href="#data-planes">Data Planes</a></li>
      <li><a href="#competitive">Competitive</a></li>
      <li><a href="#roadmap">Roadmap</a></li>
      <li><a href="#security">Security</a></li>
    </ul>
    <div class="nav-actions">
      <span class="nav-badge">NDP v1.0</span>
      <button class="save-pdf" onclick="window.print()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Save as PDF
      </button>
    </div>
  </div>
</nav>

<!-- ============================================================
     HERO
============================================================ -->
<section id="hero">
  <div class="wrapper">
    <div class="hero">
      <div class="hero-glow"></div>
      <div class="version-tag">Version 1.2 — April 2026 &nbsp;·&nbsp; Apache-2.0 Open Source</div>
      <h1>NDN IPFS Chain<br /><span class="gradient-text">White Paper</span></h1>
      <p class="hero-sub">Enterprise IPFS for the AI Era</p>
      <p class="hero-desc">
        The <strong>NDN Data Protocol (NDP) v1.0</strong> collapses three separate protocol stacks into one. One canonical envelope spans three database workloads — <strong>Blobs</strong>, <strong>Models</strong>, and <strong>Structured Records</strong> — under a single auth surface, billing meter, and audit trail.
      </p>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-val">3</div>
          <div class="hero-stat-label">Data Planes</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-val">1</div>
          <div class="hero-stat-label">Protocol Envelope</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-val">Live</div>
          <div class="hero-stat-label">Cloud Run API</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-val">$50k</div>
          <div class="hero-stat-label">Grant Milestones</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-val">v1.0</div>
          <div class="hero-stat-label">NDP Spec</div>
        </div>
      </div>

      <div class="hero-meta">
        <span class="badge-live">Live</span>
        <span>API: <a href="https://ndn-api-1037328355027.us-west1.run.app/_health" target="_blank">ndn-api · us-west1</a></span>
        <span>·</span>
        <span>Dashboard: <a href="https://ndn-dashboard-1037328355027.us-west1.run.app" target="_blank">ndn-dashboard · us-west1</a></span>
        <span>·</span>
        <span>GitHub: <a href="https://github.com/dnkefua/ndn-ipfs-chain" target="_blank">dnkefua/ndn-ipfs-chain</a></span>
        <span>·</span>
        <span>Nkefua Desmond — NDN Analytics Inc. · Dubai / Tulsa, OK</span>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     EXECUTIVE SUMMARY
============================================================ -->
<section id="exec-summary" style="padding-top: 0;">
  <div class="wrapper">
    <div class="callout reveal">
      <strong>Executive Summary:</strong> The IPFS ecosystem has solved blob pinning. Pinata, Web3.Storage, and Filebase all pin bytes reliably. What they do not solve — and what production teams consistently need — is the full data stack: blob pinning <em>plus</em> a content-addressed model registry <em>plus</em> queryable structured records, all under one authentication surface, one billing meter, and one audit trail. <strong>NDP v1.0</strong> solves this with one protocol envelope and three data planes, live on Google Cloud Run since April 2026.
    </div>
  </div>
</section>

<!-- ============================================================
     PROBLEM
============================================================ -->
<section id="problem">
  <div class="wrapper">
    <div class="section-tag reveal">01 The Problem</div>
    <h2 class="section-title reveal">Three Unrelated Protocol<br /><span class="gradient-text">Stacks Today</span></h2>
    <p class="section-desc reveal">
      Production IPFS applications today assemble a patchwork from three separate tool families, none of which interoperate at the protocol level.
    </p>

    <div class="problem-grid">
      <div class="problem-card reveal reveal-delay-1">
        <div class="problem-icon">📦</div>
        <h3>Blob Pinning</h3>
        <p>Pinata, Web3.Storage, Filebase, Fleek standardized blob pinning — a genuine success. But it stops at bytes. No query. No schema enforcement. No model semantics. A team needing structured data or model weights on top of blob storage is on their own.</p>
        <p style="margin-top: 12px; padding: 12px; background: rgba(239,68,68,0.07); border-radius: 8px; border: 1px solid rgba(239,68,68,0.15); font-size: 13px; color: #fc8181;">
          ⚠ A dApp developer pinning NFT metadata with Pinata and user records with Postgres has no single content-addressed audit trail.
        </p>
      </div>
      <div class="problem-card reveal reveal-delay-2">
        <div class="problem-icon">🤖</div>
        <h3>AI/ML Model Weights</h3>
        <p>HuggingFace Hub is centralized. S3 gives no CID. A 70B-parameter model consists of hundreds of weight shards, a shard map, a model card, and eval results — no standard content-addressed format exists for this. Reproducibility fails at the storage layer.</p>
        <p style="margin-top: 12px; padding: 12px; background: rgba(239,68,68,0.07); border-radius: 8px; border: 1px solid rgba(239,68,68,0.15); font-size: 13px; color: #fc8181;">
          ⚠ Teams must write bespoke download-and-pin scripts, manage shard ordering, and construct shard maps by hand.
        </p>
      </div>
      <div class="problem-card reveal reveal-delay-3">
        <div class="problem-icon">🗄️</div>
        <h3>Structured Records</h3>
        <p>Tableland offers SQL-flavored data with no blob or model handling. Ceramic gives mutable documents with heavy client complexity. OrbitDB is embedded-only. None expose a standard content-addressed envelope that produces the same CID across two independent implementations.</p>
        <p style="margin-top: 12px; padding: 12px; background: rgba(239,68,68,0.07); border-radius: 8px; border: 1px solid rgba(239,68,68,0.15); font-size: 13px; color: #fc8181;">
          ⚠ Compliance teams cannot prove "this exact dataset was in this exact state at this timestamp" with a standard primitive.
        </p>
      </div>
    </div>

    <div class="callout reveal">
      <strong>The Consequence:</strong> Teams either abandon IPFS for the hard cases or build one-off glue layers that lock them into a specific implementation. Neither outcome serves the ecosystem. NDP v1.0 is the standard-layer solution.
    </div>
  </div>
</section>

<!-- ============================================================
     NDP THESIS
============================================================ -->
<section id="thesis">
  <div class="wrapper">
    <div class="section-tag reveal">02 The NDP Thesis</div>
    <h2 class="section-title reveal">One Envelope,<br /><span class="gradient-text">Three Data Planes</span></h2>
    <p class="section-desc reveal">
      The NDN Data Protocol makes one claim: every persistent object a production application needs can be expressed as a canonical JSON envelope, hashed deterministically, and addressed by a CIDv1. Three data planes emerge naturally from this foundation.
    </p>

    <!-- Canonicalization Flow -->
    <div class="envelope-visual reveal">
      <h3 class="sub-title" style="margin-bottom: 24px;">Canonicalization Pipeline</h3>
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 32px;">
        <div style="background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); border-radius: 10px; padding: 14px 20px; text-align: center; flex: 1; min-width: 120px;">
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--blue-400); margin-bottom: 6px;">INPUT</div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">JSON Object</div>
        </div>
        <div style="font-size: 24px; color: var(--blue-500); padding: 0 4px;">→</div>
        <div style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); border-radius: 10px; padding: 14px 20px; text-align: center; flex: 1; min-width: 120px;">
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--purple-400); margin-bottom: 6px;">RFC 8785</div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">JCS Canonical</div>
        </div>
        <div style="font-size: 24px; color: var(--blue-500); padding: 0 4px;">→</div>
        <div style="background: rgba(34,211,238,0.12); border: 1px solid rgba(34,211,238,0.3); border-radius: 10px; padding: 14px 20px; text-align: center; flex: 1; min-width: 120px;">
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--cyan-400); margin-bottom: 6px;">SHA-256</div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Hash Digest</div>
        </div>
        <div style="font-size: 24px; color: var(--blue-500); padding: 0 4px;">→</div>
        <div style="background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.3); border-radius: 10px; padding: 14px 20px; text-align: center; flex: 1; min-width: 120px;">
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--emerald-400); margin-bottom: 6px;">OUTPUT</div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">CIDv1 (raw)</div>
        </div>
      </div>

      <h3 class="sub-title" style="margin-bottom: 20px;">The Canonical Envelope</h3>
      <div class="code-block-wrap">
        <div class="code-block-head">
          <div class="code-dots"><span></span><span></span><span></span></div>
          <span class="code-lang">NDP Envelope · JSON</span>
        </div>
        <div class="code-body">{
  <span class="s">"ndp"</span>:     <span class="v">"1"</span>,
  <span class="s">"kind"</span>:    <span class="v">"record | blob-meta | model-version | schema | view-snapshot | collection-head"</span>,
  <span class="s">"tenant"</span>:  <span class="v" style="color:var(--cyan-400)">&lt;uuid&gt;</span>,
  <span class="s">"created"</span>: <span class="v" style="color:var(--cyan-400)">&lt;RFC-3339 timestamp&gt;</span>,
  <span class="s">"parent"</span>:  <span class="v" style="color:var(--cyan-400)">&lt;CID | null&gt;</span>,   <span class="c">// links to predecessor → version chain</span>
  <span class="s">"body"</span>:    { <span class="c">/* data-plane specific payload */</span> }
}</div>
      </div>
      <p style="font-size: 14px; margin: 0; color: var(--text-secondary);">The <code style="font-family: var(--font-mono); color: var(--cyan-400);">parent</code> field forms a content-addressed version chain. The <code style="font-family: var(--font-mono); color: var(--cyan-400);">tenant</code> field is part of the canonical form — two tenants storing identical content produce different CIDs, ensuring multi-tenant isolation by design.</p>
    </div>
  </div>
</section>

<!-- ============================================================
     ARCHITECTURE
============================================================ -->
<section id="architecture">
  <div class="wrapper">
    <div class="section-tag reveal">03 Architecture</div>
    <h2 class="section-title reveal">Single Control Plane,<br /><span class="gradient-text">Unified Auth Surface</span></h2>
    <p class="section-desc reveal">All three data planes share one tenant-scoped authentication model, one billing meter, one audit trail, and AES-256-GCM envelope encryption with KMS-managed keys. A single <code style="font-family: var(--font-mono); font-size: 15px; color: var(--cyan-400);">GET /v1/_discovery</code> endpoint advertises which data planes a deployment exposes.</p>

    <div class="arch-diagram reveal">
      <h3 class="sub-title" style="margin-bottom: 32px; position: relative; z-index: 1;">System Architecture — NDP v1.0</h3>
      <!-- Layer: Clients -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; position: relative; z-index: 1;">
        <div style="text-align: center; flex: 1; min-width: 200px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 14px;">Clients</div>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <div class="arch-node">Web App</div>
            <div class="arch-node">CLI</div>
            <div class="arch-node">JS/TS SDK</div>
            <div class="arch-node">Python SDK</div>
            <div class="arch-node">REST API</div>
          </div>
        </div>
      </div>
      <div style="text-align: center; color: var(--blue-500); font-size: 22px; margin: 8px 0; position: relative; z-index: 1;">↓</div>
      <!-- Layer: Auth -->
      <div style="margin-bottom: 20px; position: relative; z-index: 1;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 12px; text-align: center;">Auth Layer</div>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <div class="arch-node highlight-blue">POST /v1/auth</div>
          <div class="arch-node">API Keys</div>
          <div class="arch-node">JWT</div>
          <div class="arch-node">SIWE (Web3)</div>
        </div>
      </div>
      <div style="text-align: center; color: var(--blue-500); font-size: 22px; margin: 8px 0; position: relative; z-index: 1;">↓</div>
      <!-- Layer: Gateway -->
      <div style="margin-bottom: 20px; position: relative; z-index: 1;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 12px; text-align: center;">API Gateway · Fastify · Cloud Run us-west1</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.25); border-radius: 12px; padding: 20px 18px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--blue-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Blob Plane</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/blobs</div>
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/pins (alias)</div>
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/upload (Tus)</div>
            </div>
          </div>
          <div style="background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.25); border-radius: 12px; padding: 20px 18px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--purple-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Model Plane</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/models</div>
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/models/stream</div>
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/models/import/hf</div>
            </div>
          </div>
          <div style="background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.25); border-radius: 12px; padding: 20px 18px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--emerald-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Records Plane</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/records</div>
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/collections</div>
              <div class="arch-node" style="font-size: 12px; padding: 8px 12px;">/v1/views · /v1/schemas</div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center; color: var(--blue-500); font-size: 22px; margin: 8px 0; position: relative; z-index: 1;">↓</div>
      <!-- Layer: Storage -->
      <div style="position: relative; z-index: 1;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 12px; text-align: center;">Storage Layer</div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
          <div class="arch-node highlight-blue" style="text-align: center;">🗂 IPFS Cluster<br><span style="font-size: 10px; opacity: 0.7;">Hot NVMe Tier</span></div>
          <div class="arch-node highlight-purple" style="text-align: center;">🧊 Filecoin<br><span style="font-size: 10px; opacity: 0.7;">Cold Archival</span></div>
          <div class="arch-node highlight-teal" style="text-align: center;">🐘 Postgres 16<br><span style="font-size: 10px; opacity: 0.7;">Cloud SQL</span></div>
          <div class="arch-node highlight-amber" style="text-align: center;">🔑 KMS<br><span style="font-size: 10px; opacity: 0.7;">Envelope Keys</span></div>
        </div>
      </div>
    </div>

    <!-- Shared primitives -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;" class="reveal">
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; font-size: 13px; color: var(--text-secondary);">
        <div style="font-size: 18px; margin-bottom: 10px;">🔐</div>
        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Tenant Isolation</div>
        Row-level SQL isolation + application-layer tenant clause enforcement on every query.
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; font-size: 13px; color: var(--text-secondary);">
        <div style="font-size: 18px; margin-bottom: 10px;">📋</div>
        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Unified Audit Log</div>
        All writes stored as NDP records in the reserved <code style="font-family: var(--font-mono); color: var(--cyan-400);">_audit</code> collection. Tamper-evident.
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; font-size: 13px; color: var(--text-secondary);">
        <div style="font-size: 18px; margin-bottom: 10px;">🛡️</div>
        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">AES-256-GCM</div>
        Envelope encryption with KMS-managed keys. Crypto-shredding satisfies GDPR Article 17.
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; font-size: 13px; color: var(--text-secondary);">
        <div style="font-size: 18px; margin-bottom: 10px;">📡</div>
        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Discovery Endpoint</div>
        <code style="font-family: var(--font-mono); color: var(--cyan-400);">GET /v1/_discovery</code> advertises which data planes are live on any given deployment.
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     DATA PLANES
============================================================ -->
<section id="data-planes">
  <div class="wrapper">
    <div class="section-tag reveal">04 Data Planes</div>
    <h2 class="section-title reveal">Three Planes,<br /><span class="gradient-text">One Protocol</span></h2>
    <p class="section-desc reveal">Each data plane has its own API surface and semantics. A deployment MAY implement all three or declare partial support via <code style="font-family: var(--font-mono); font-size: 15px; color: var(--cyan-400);">GET /v1/_discovery</code>.</p>

    <div class="planes-grid">
      <!-- Blobs -->
      <div class="plane-card reveal">
        <div class="plane-header">
          <div class="plane-number">Data Plane 01</div>
          <div class="plane-icon">📦</div>
          <div class="plane-name">Blobs</div>
          <div class="plane-subtitle">/v1/blobs · /v1/pins (PSA v1.0 alias)</div>
        </div>
        <div class="plane-body">
          <p>Arbitrary-byte payloads. A strict superset of IPFS Pinning Services API v1.0 — every existing tool works without modification.</p>
          <ul class="plane-features">
            <li>Tiered storage: hot / cold / filecoin lifecycle policies</li>
            <li>Per-pin replication factor (default 3, enterprise 5–9)</li>
            <li>AES-256-GCM envelope encryption before upload</li>
            <li>Resumable upload via Tus protocol</li>
            <li>Versioned blob-meta envelope per upload</li>
          </ul>
        </div>
      </div>

      <!-- Models -->
      <div class="plane-card reveal reveal-delay-1">
        <div class="plane-header">
          <div class="plane-number">Data Plane 02</div>
          <div class="plane-icon">🤖</div>
          <div class="plane-name">Models</div>
          <div class="plane-subtitle">/v1/models · UnixFS DAG bundles</div>
        </div>
        <div class="plane-body">
          <p>Content-addressed AI/ML model registry. Each version is a UnixFS DAG: weight shards + shard map + model card + version envelope.</p>
          <ul class="plane-features">
            <li>CIDv1 for every weight shard independently</li>
            <li>UnixFS DAG-walkable with standard IPFS tools</li>
            <li>(name, version) → immutable root CID versioning</li>
            <li>Range-addressable streaming via HTTP Range</li>
            <li>HuggingFace one-command import</li>
            <li>Tensor-level retrieval (experimental)</li>
          </ul>
        </div>
      </div>

      <!-- Records -->
      <div class="plane-card reveal reveal-delay-2">
        <div class="plane-header">
          <div class="plane-number">Data Plane 03</div>
          <div class="plane-icon">📚</div>
          <div class="plane-name">Structured Records</div>
          <div class="plane-subtitle">/v1/records · /v1/collections · /v1/views</div>
        </div>
        <div class="plane-body">
          <p>Queryable JSON documents with schemas, immutable version chains, collections, and content-addressed views.</p>
          <ul class="plane-features">
            <li>Immutable write → new CID, parent links preserved</li>
            <li>Mongo-ish query DSL ($gt, $in, $and, dot-path)</li>
            <li>JSON Schema Draft 2020-12 enforcement</li>
            <li>Content-addressed views (on_write / interval / manual)</li>
            <li>SSE stream of head CID changes</li>
            <li>Full GET /history version chain retrieval</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- API Tables -->
    <h3 class="sub-title reveal" style="margin-bottom: 28px;">Complete API Surface</h3>

    <!-- Blobs API -->
    <div class="api-section-wrap reveal">
      <div class="api-section-head">
        <div class="api-section-head-icon" style="background: rgba(59,130,246,0.15);">📦</div>
        <div>
          <h3>Blob API</h3>
          <p>/v1/blobs · /v1/pins · /v1/upload</p>
        </div>
      </div>
      <div class="api-table-wrap">
        <table>
          <thead><tr><th>Method</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/blobs</td><td>Upload raw bytes. Returns <code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">{ cid, size, meta_cid }</code>.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/blobs/:cid</td><td>Retrieve raw bytes. Supports Range headers.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/blobs/:cid/meta</td><td>Retrieve metadata envelope.</td></tr>
            <tr><td><span class="method-badge method-delete">DELETE</span></td><td class="code-path">/v1/blobs/:cid</td><td>Unpin and crypto-shred if encrypted.</td></tr>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/upload</td><td>Tus resumable upload endpoint.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/pins</td><td>Pinning Services API v1.0 alias.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Models API -->
    <div class="api-section-wrap reveal">
      <div class="api-section-head">
        <div class="api-section-head-icon" style="background: rgba(139,92,246,0.15);">🤖</div>
        <div>
          <h3>Models API</h3>
          <p>/v1/models · HuggingFace import · Range streaming</p>
        </div>
      </div>
      <div class="api-table-wrap">
        <table>
          <thead><tr><th>Method</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/models</td><td>Create a model referencing already-pinned shard CIDs.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/models/:name</td><td>List all versions of a model.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/models/:name/:version</td><td>Retrieve version envelope + shard map + model card.</td></tr>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/models/:name/versions</td><td>Create a new version (immutable, new CID).</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/models/:name/:version/shards/:shard</td><td>Retrieve a shard by logical name.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/models/:name/:version/stream</td><td>Range-addressable weight streaming.</td></tr>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/models/import/huggingface</td><td>Import from HuggingFace by repo ID. Async for large models.</td></tr>
            <tr><td><span class="method-badge method-delete">DELETE</span></td><td class="code-path">/v1/models/:name/:version</td><td>Remove the registry pointer (CID content remains).</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Records API -->
    <div class="api-section-wrap reveal">
      <div class="api-section-head">
        <div class="api-section-head-icon" style="background: rgba(52,211,153,0.15);">📚</div>
        <div>
          <h3>Records API</h3>
          <p>/v1/records · /v1/collections · /v1/views · /v1/schemas</p>
        </div>
      </div>
      <div class="api-table-wrap">
        <table>
          <thead><tr><th>Method</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/records</td><td>Write a record. Body: <code style="font-family:var(--font-mono);font-size:11px;color:var(--cyan-400)">{ collection, id?, body, schema_cid? }</code>.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/records/:cid</td><td>Retrieve any envelope by CID.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/records/:collection/:id</td><td>Latest version by logical ID.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/records/:collection/:id?at=&lt;cid&gt;</td><td>Specific historical version by CID.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/records/:collection/:id/history</td><td>Full version chain (most recent first).</td></tr>
            <tr><td><span class="method-badge method-delete">DELETE</span></td><td class="code-path">/v1/records/:collection/:id</td><td>Remove collection-head entry. CID remains.</td></tr>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/collections/:name/query</td><td>Mongo-ish filter query with projections and sorting.</td></tr>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/views</td><td>Create a named saved query with refresh mode.</td></tr>
            <tr><td><span class="method-badge method-get">GET</span></td><td class="code-path">/v1/views/:name/stream</td><td>SSE stream of head CID changes.</td></tr>
            <tr><td><span class="method-badge method-post">POST</span></td><td class="code-path">/v1/schemas</td><td>Register a JSON Schema Draft 2020-12 schema.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Query Example -->
    <div class="code-block-wrap reveal">
      <div class="code-block-head">
        <div class="code-dots"><span></span><span></span><span></span></div>
        <span class="code-lang">Example: Mongo-ish Query DSL</span>
      </div>
      <div class="code-body"><span class="k">POST</span> <span class="n">/v1/collections/users/query</span>
<span class="k">Content-Type</span>: <span class="s">application/json</span>
<span class="k">Authorization</span>: <span class="s">Bearer ndk_...</span>

{
  <span class="s">"filter"</span>: {
    <span class="p">"$and"</span>: [
      { <span class="s">"age"</span>: { <span class="p">"$gte"</span>: <span class="v">18</span> } },
      { <span class="s">"plan"</span>: { <span class="p">"$in"</span>: [<span class="s">"pro"</span>, <span class="s">"enterprise"</span>] } },
      { <span class="s">"address.city"</span>: <span class="s">"Lagos"</span> }
    ]
  },
  <span class="s">"projection"</span>: [<span class="s">"id"</span>, <span class="s">"email"</span>, <span class="s">"plan"</span>],
  <span class="s">"sort"</span>: { <span class="s">"created_at"</span>: <span class="v">-1</span> },
  <span class="s">"limit"</span>: <span class="v">50</span>
}</div>
    </div>
  </div>
</section>

<!-- ============================================================
     COMPETITIVE LANDSCAPE
============================================================ -->
<section id="competitive">
  <div class="wrapper">
    <div class="section-tag reveal">05 Competitive Landscape</div>
    <h2 class="section-title reveal">NDN vs. The Field<br /><span class="gradient-text">April 2026</span></h2>
    <p class="section-desc reveal">The table reflects what each provider actually offers as of April 2026. Only checked entries reflect documented or publicly announced features.</p>

    <div class="comp-table-wrap reveal">
      <table>
        <thead>
          <tr>
            <th>Capability</th>
            <th class="col-ndn">NDN IPFS Chain</th>
            <th>Pinata</th>
            <th>Web3.Storage</th>
            <th>Filebase</th>
            <th>Fleek</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Blob pinning (PSA v1.0)</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-yes">✓</span></td>
            <td><span class="check-yes">✓</span></td>
            <td><span class="check-yes">✓</span></td>
            <td><span class="check-yes">✓</span></td>
          </tr>
          <tr>
            <td>AI/ML model registry</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>Structured records + query</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>AES-256-GCM encryption (default)</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>Filecoin cold archival</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>Crypto-shredding (GDPR erasure)</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>Resumable upload (Tus)</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>Open conformance test suite</td>
            <td class="col-ndn"><span class="check-planned">Planned M1</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
          <tr>
            <td>Apache-2.0 reference implementation</td>
            <td class="col-ndn"><span class="check-yes">✓</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
            <td><span class="check-no">✗</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- ============================================================
     WHY NOW
============================================================ -->
<section id="why-now">
  <div class="wrapper">
    <div class="section-tag reveal">06 Why Now</div>
    <h2 class="section-title reveal">The Window Is<br /><span class="gradient-text">Open</span></h2>
    <p class="section-desc reveal">Three things are now true that were not true three years ago. The protocol-level standard window is open — the ecosystem has not yet fragmented around incompatible structured-data and model-registry approaches.</p>

    <div class="reasons-list">
      <div class="reason-item reveal">
        <div class="reason-num">1</div>
        <div class="reason-text">
          <h3>PSA v1.0 Solved Blob Pinning</h3>
          <p>The Pinning Services API v1.0 standardized blob pinning across providers. The battle for blob interoperability is mostly won. The next layer — models and structured data — has no equivalent standard. The ecosystem is ready for the application-layer protocol stack.</p>
        </div>
      </div>
      <div class="reason-item reveal reveal-delay-1">
        <div class="reason-num">2</div>
        <div class="reason-text">
          <h3>AI/ML Teams Generate Content-Addressed Data — They Just Don't Know It</h3>
          <p>Model weights are deterministic byte sequences. The same model checkpoint, trained identically, produces the same bytes. The missing piece is a standard that makes content addressing first-class at the model-registry layer. Without it, teams keep workunits in centralized silos — HuggingFace, S3 — with no CID.</p>
        </div>
      </div>
      <div class="reason-item reveal reveal-delay-2">
        <div class="reason-num">3</div>
        <div class="reason-text">
          <h3>GDPR Created Demand for Cryptographic Deletion on Immutable Storage</h3>
          <p>IPFS's immutability is a feature, not a bug — but it creates a real compliance problem for data that may need erasure. Crypto-shredding (delete the encryption key → all affected CIDs become permanently unreadable) is the correct solution. NDP's envelope encryption makes this a first-class primitive rather than an afterthought.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     IMPLEMENTATION STATUS
============================================================ -->
<section id="status">
  <div class="wrapper">
    <div class="section-tag reveal">07 Implementation Status</div>
    <h2 class="section-title reveal">Live on Google Cloud Run<br /><span class="gradient-text">As of April 2026</span></h2>
    <p class="section-desc reveal">The API is live, the Structured DB migration is deployed, and the full three-plane API surface is accepting traffic. Health check and dashboard URLs are publicly reachable and return in under 500 ms from us-west1.</p>

    <div class="status-grid">
      <div class="status-item reveal">
        <div class="status-dot"></div>
        <div class="status-info">
          <h4>Fastify REST API (NDP Reference)</h4>
          <p>ndn-api-1037328355027.us-west1.run.app</p>
        </div>
        <span class="status-badge">Live</span>
      </div>
      <div class="status-item reveal reveal-delay-1">
        <div class="status-dot"></div>
        <div class="status-info">
          <h4>Next.js Dashboard (14 routes)</h4>
          <p>ndn-dashboard-1037328355027.us-west1.run.app</p>
        </div>
        <span class="status-badge">Live</span>
      </div>
      <div class="status-item reveal reveal-delay-2">
        <div class="status-dot"></div>
        <div class="status-info">
          <h4>Postgres 16 on Cloud SQL</h4>
          <p>Migrated — multi-tenant schema deployed</p>
        </div>
        <span class="status-badge">Live</span>
      </div>
      <div class="status-item reveal reveal-delay-1">
        <div class="status-dot"></div>
        <div class="status-info">
          <h4>/v1/pins · /v1/models · /v1/records</h4>
          <p>All three data planes accepting traffic</p>
        </div>
        <span class="status-badge">Live</span>
      </div>
      <div class="status-item reveal reveal-delay-2">
        <div class="status-dot"></div>
        <div class="status-info">
          <h4>NDP v1.0 Spec</h4>
          <p>Published — specs/ndp_protocol.md</p>
        </div>
        <span class="status-badge">Published</span>
      </div>
      <div class="status-item reveal reveal-delay-3">
        <div class="status-dot" style="background: var(--blue-400); box-shadow: 0 0 8px var(--blue-400);"></div>
        <div class="status-info">
          <h4>Reference Implementation (Apache-2.0)</h4>
          <p>github.com/dnkefua/ndn-ipfs-chain</p>
        </div>
        <span class="status-badge" style="color: var(--blue-400); border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.1);">Public</span>
      </div>
    </div>

    <div class="callout reveal">
      <strong>SDK Development in Progress:</strong> The JS/TS (<code style="font-family:var(--font-mono);color:var(--cyan-400)">@ndnanalytics/ipfs</code>), Python (<code style="font-family:var(--font-mono);color:var(--cyan-400)">ndn-ipfs</code>), and CLI (<code style="font-family:var(--font-mono);color:var(--cyan-400)">ndn</code>) SDKs are the primary deliverable of Grant Milestone M1. They are in active development and will publish to npm and PyPI at M1 completion.
    </div>
  </div>
</section>

<!-- ============================================================
     ROADMAP
============================================================ -->
<section id="roadmap">
  <div class="wrapper">
    <div class="section-tag reveal">08 Roadmap</div>
    <h2 class="section-title reveal">Four Grant Milestones<br /><span class="gradient-text">12-Month Plan</span></h2>
    <p class="section-desc reveal">Roadmap tied to the IPFS Foundation grant milestones. Total gate payments: $50,000. All targets from <code style="font-family:var(--font-mono);font-size:15px;color:var(--cyan-400)">grants/MILESTONES.md</code>.</p>

    <div class="milestones">
      <div class="milestone reveal">
        <div class="milestone-dot">M1</div>
        <div class="milestone-content">
          <div class="milestone-header">
            <div>
              <div class="milestone-title">SDK Foundation + Pinning Services Conformance</div>
              <div class="milestone-month">Month 3</div>
            </div>
            <div class="milestone-pay">💰 $15,000</div>
          </div>
          <ul class="milestone-items">
            <li><code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">@ndnanalytics/ipfs</code> (JS/TypeScript) v1.0 on npm — ESM + CJS + browser bundles, WebCrypto AES-256-GCM, tus streaming</li>
            <li><code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">ndn-ipfs</code> (Python) v1.0 on PyPI — sync + async (httpx), Pydantic v2 models</li>
            <li><code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">ndn</code> CLI — static binary, <code style="font-family:var(--font-mono);font-size:12px;color:var(--amber-400)">pin add / list / get / keys rotate</code>, works against any PSA v1.0 backend</li>
            <li>Open-source Pinning Services API v1.0 conformance suite — NDN passes ≥ 80%</li>
            <li>NDP v1.0 spec posted for community review</li>
          </ul>
        </div>
      </div>

      <div class="milestone reveal">
        <div class="milestone-dot">M2</div>
        <div class="milestone-content">
          <div class="milestone-header">
            <div>
              <div class="milestone-title">Public Gateway Live in 3 Regions</div>
              <div class="milestone-month">Month 6</div>
            </div>
            <div class="milestone-pay">💰 $15,000</div>
          </div>
          <ul class="milestone-items">
            <li><code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">gateway.ndnipfs.com</code> in us-west, eu-west, ap-southeast — anycast DNS, Cloudflare Workers + R2 fronting Cloud Run</li>
            <li>Subdomain gateway at <code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">&lt;cid&gt;.ipfs.ndnipfs.com</code> with origin isolation</li>
            <li><code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">?verify=true</code> trustless retrieval — re-hashes content at edge, returns <code style="font-family:var(--font-mono);font-size:12px;color:var(--amber-400)">X-Ipfs-Verified</code> header</li>
            <li>Listed on the IPFS public gateway checker</li>
            <li>Third-party security audit complete — findings remediated and published</li>
            <li>NDP conformance suite in beta</li>
          </ul>
        </div>
      </div>

      <div class="milestone reveal">
        <div class="milestone-dot">M3</div>
        <div class="milestone-content">
          <div class="milestone-header">
            <div>
              <div class="milestone-title">Filecoin Integration + Proofs Dashboard</div>
              <div class="milestone-month">Month 9</div>
            </div>
            <div class="milestone-pay">💰 $10,000</div>
          </div>
          <ul class="milestone-items">
            <li>Filecoin broker integrated — tier=filecoin pins trigger CAR packing + Boost deal submission across ≥ 3 Storage Provider partners</li>
            <li>Proofs dashboard — per-CID deal list, PoSt verification status, weekly retrieval test results (public scorecard)</li>
            <li>Automated deal renewal for deals within 30 days of expiry</li>
            <li>SP scorecard published monthly</li>
          </ul>
        </div>
      </div>

      <div class="milestone reveal">
        <div class="milestone-dot">M4</div>
        <div class="milestone-content">
          <div class="milestone-header">
            <div>
              <div class="milestone-title">Year-1 Scale + Full Conformance</div>
              <div class="milestone-month">Month 12</div>
            </div>
            <div class="milestone-pay">💰 $10,000</div>
          </div>
          <ul class="milestone-items">
            <li>Full Pinning Services API v1.0 conformance (100% of public test suite)</li>
            <li>5 published tutorials at <code style="font-family:var(--font-mono);font-size:12px;color:var(--cyan-400)">docs.ndnipfs.com</code></li>
            <li>One conference talk delivered and recorded (IPFS Thing or Devcon)</li>
            <li>Public Year-1 report — actual vs. target KPIs, lessons learned, sustainability plan</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Year-1 Metrics -->
    <h3 class="sub-title reveal" style="margin: 60px 0 8px;">Year-1 End-State Targets</h3>
    <p class="reveal" style="margin-bottom: 0;">Calibrated to first-year reality for a solo developer with a free tier. Stated explicitly in the grant application.</p>
    <div class="metrics-grid">
      <div class="metric-card reveal reveal-delay-1">
        <div class="metric-val">15,000</div>
        <div class="metric-lbl">SDK Monthly Downloads (npm + PyPI)</div>
      </div>
      <div class="metric-card reveal reveal-delay-2">
        <div class="metric-val">5M</div>
        <div class="metric-lbl">Unique CIDs Pinned via NDN</div>
      </div>
      <div class="metric-card reveal reveal-delay-3">
        <div class="metric-val">100K</div>
        <div class="metric-lbl">Public Gateway Unique Clients / Month</div>
      </div>
      <div class="metric-card reveal reveal-delay-4">
        <div class="metric-val">&lt;250ms</div>
        <div class="metric-lbl">Gateway p95 TTFB</div>
      </div>
      <div class="metric-card reveal">
        <div class="metric-val">99.95%</div>
        <div class="metric-lbl">Gateway Uptime (rolling 90d)</div>
      </div>
      <div class="metric-card reveal reveal-delay-1">
        <div class="metric-val">500 GiB</div>
        <div class="metric-lbl">Stored on Filecoin via NDN</div>
      </div>
      <div class="metric-card reveal reveal-delay-2">
        <div class="metric-val">2,500</div>
        <div class="metric-lbl">Verified Filecoin Deals</div>
      </div>
      <div class="metric-card reveal reveal-delay-3">
        <div class="metric-val">10,000</div>
        <div class="metric-lbl">Tracked Tutorial Completions</div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SECURITY
============================================================ -->
<section id="security">
  <div class="wrapper">
    <div class="section-tag reveal">09 Security & Threat Model</div>
    <h2 class="section-title reveal">Defense in Depth<br /><span class="gradient-text">From Protocol to KMS</span></h2>
    <p class="section-desc reveal">Security is layered at the protocol level, not bolted on. Every primitive — tenant isolation, encryption, CID integrity, reserved namespaces — is normative in the NDP v1.0 spec.</p>

    <div class="security-grid">
      <div class="security-card reveal">
        <div class="security-icon">🔒</div>
        <h3>Tenant Isolation</h3>
        <p>Every persistent row and every cache key includes the tenant UUID. Enforcement is layered: application-layer query builder AND Postgres row-level security policies. A bug in application code cannot leak data between tenants without bypassing the SQL layer. Tested as commit <code style="font-family:var(--font-mono);color:var(--cyan-400)">b603edf9</code>.</p>
      </div>
      <div class="security-card reveal reveal-delay-1">
        <div class="security-icon">🔑</div>
        <h3>Envelope Encryption + Crypto-Shredding</h3>
        <p>Client-side AES-256-GCM with per-tenant keys managed by KMS. <strong>Deleting the envelope key renders all affected CIDs permanently unreadable.</strong> Satisfies GDPR Article 17 on immutable storage. Key deletion event is recorded on-chain as tamper-evident proof of destruction.</p>
      </div>
      <div class="security-card reveal reveal-delay-2">
        <div class="security-icon">🔗</div>
        <h3>CID Integrity</h3>
        <p>SHA-256 provides 128-bit collision resistance. JCS canonicalization is deterministic — any deviation from RFC 8785 causes CID divergence. The NDP conformance suite includes canonical-form test vectors that any implementation must pass. Implementations storing &gt;2^64 objects SHOULD migrate to SHA-512.</p>
      </div>
      <div class="security-card reveal reveal-delay-3">
        <div class="security-icon">🚧</div>
        <h3>Reserved Collections</h3>
        <p><code style="font-family:var(--font-mono);color:var(--cyan-400)">_schemas</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">_views</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">_audit</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">_meta</code> are privileged namespaces. Direct writes via <code style="font-family:var(--font-mono);color:var(--cyan-400)">POST /v1/records</code> are rejected — mutations MUST go through privileged endpoints. This prevents audit log tampering.</p>
      </div>
      <div class="security-card reveal">
        <div class="security-icon">🛡️</div>
        <h3>Rate Limiting & Abuse Prevention</h3>
        <p>Free-tier gateway: 500 req/min/IP, 50 GB/month per anonymous account. CID blocklist integration via Cloudflare and Badbits feeds. Public abuse contact (<code style="font-family:var(--font-mono);color:var(--cyan-400)">abuse@ndnipfs.com</code>) and DMCA process in place. Reference implementation's abuse policy published in repository.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     GOVERNANCE
============================================================ -->
<section id="governance">
  <div class="wrapper">
    <div class="section-tag reveal">10 Governance</div>
    <h2 class="section-title reveal">Open Protocol,<br /><span class="gradient-text">No Open-Core Split</span></h2>
    <p class="section-desc reveal">The specification is CC-BY 4.0. The reference implementation is Apache-2.0. The commercial product runs on the same open primitives, differentiated by operational features — not by source-code locks.</p>

    <div class="govern-card reveal">
      <h3>License Structure</h3>
      <div style="margin-bottom: 20px;">
        <span class="license-badge license-cc">📄 CC-BY 4.0</span>
        <span style="font-size: 14px; color: var(--text-secondary);">NDP v1.0 Specification (<code style="font-family:var(--font-mono);color:var(--cyan-400)">specs/ndp_protocol.md</code>) — Any party may implement NDP v1.0 without royalties, restrictions, or attribution requirements beyond the license terms.</span>
      </div>
      <div style="margin-bottom: 20px;">
        <span class="license-badge license-apache">⚖️ Apache-2.0</span>
        <span style="font-size: 14px; color: var(--text-secondary);">Reference implementation (<code style="font-family:var(--font-mono);color:var(--cyan-400)">github.com/dnkefua/ndn-ipfs-chain</code>) — No open-core split. The commercial product runs on the same open primitives.</span>
      </div>
    </div>

    <div class="govern-card reveal">
      <h3>Open Conformance Suite</h3>
      <p><code style="font-family:var(--font-mono);color:var(--cyan-400)">@ndnanalytics/ndp-conformance</code> and <code style="font-family:var(--font-mono);color:var(--cyan-400)">@ndnanalytics/pinning-services-conformance</code> will be published in M1. Any provider can run the suite to claim conformance. Conformance is self-declared against published test vectors — no central certification body required.</p>
    </div>

    <div class="govern-card reveal">
      <h3>IPIP-Style Community Review</h3>
      <p>Within the grant period, NDP v1.0 will be submitted for IPFS community review via the working-group process, targeting a status equivalent to an IPFS Improvement Proposal. The spec is deliberately storage-backend agnostic — an NDP provider using Arweave instead of Filecoin is a conforming implementation.</p>
      <p style="margin-top: 12px; margin-bottom: 0; font-size: 14px; color: var(--text-muted);">Reserved collection names (<code style="font-family:var(--font-mono);color:var(--cyan-400)">_schemas</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">_views</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">_audit</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">_meta</code>) and query extensions (<code style="font-family:var(--font-mono);color:var(--cyan-400)">$regex</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">$text</code>, <code style="font-family:var(--font-mono);color:var(--cyan-400)">$near</code>) require spec revision — not an implementation decision.</p>
    </div>
  </div>
</section>

<!-- ============================================================
     REFERENCES
============================================================ -->
<section id="references" style="padding-bottom: 60px;">
  <div class="wrapper">
    <div class="section-tag reveal">11 References</div>
    <h2 class="section-title reveal">Specifications &<br /><span class="gradient-text">External Links</span></h2>

    <ul class="ref-list reveal">
      <li>NDP v1.0 specification — <a href="#">specs/ndp_protocol.md</a></li>
      <li>System specification v2.0 — <a href="#">specs/system_spec.md</a></li>
      <li>IPFS Foundation grant application — <a href="#">grants/IPFS_GRANT_APPLICATION.md</a></li>
      <li>Grant milestones — <a href="#">grants/MILESTONES.md</a></li>
      <li>IPFS Pinning Services API v1.0 — <a href="https://ipfs.github.io/pinning-services-api-spec/" target="_blank">ipfs.github.io/pinning-services-api-spec/</a></li>
      <li>JCS (JSON Canonicalization Scheme) — <a href="https://www.rfc-editor.org/rfc/rfc8785" target="_blank">RFC 8785 — rfc-editor.org</a></li>
      <li>CID specification — <a href="https://github.com/multiformats/cid" target="_blank">github.com/multiformats/cid</a></li>
      <li>JSON Schema Draft 2020-12 — <a href="https://json-schema.org/specification" target="_blank">json-schema.org/specification</a></li>
      <li>Public repository — <a href="https://github.com/dnkefua/ndn-ipfs-chain" target="_blank">github.com/dnkefua/ndn-ipfs-chain</a></li>
      <li>Live API health — <a href="https://ndn-api-1037328355027.us-west1.run.app/_health" target="_blank">ndn-api-1037328355027.us-west1.run.app/_health</a></li>
      <li>Live dashboard — <a href="https://ndn-dashboard-1037328355027.us-west1.run.app" target="_blank">ndn-dashboard-1037328355027.us-west1.run.app</a></li>
    </ul>
  </div>
</section>

<!-- ============================================================
     FOOTER
============================================================ -->
<footer>
  <div class="footer-inner">
    <div class="footer-logo">NDN IPFS Chain</div>
    <div class="footer-links">
      <a href="https://github.com/dnkefua/ndn-ipfs-chain" target="_blank">GitHub</a>
      <a href="https://ndn-api-1037328355027.us-west1.run.app/_health" target="_blank">API Health</a>
      <a href="https://ndn-dashboard-1037328355027.us-west1.run.app" target="_blank">Dashboard</a>
      <a href="https://twitter.com/dnkefua" target="_blank">Twitter/X @dnkefua</a>
    </div>
    <p class="footer-copy">
      <strong>Nkefua Desmond ("Blockchainer")</strong> — Founder &amp; Sole Developer, NDN Analytics Inc. (Tulsa, Oklahoma; formed April 2026). Based in Dubai.<br />
      <a href="mailto:nkefuan@yahoo.com">nkefuan@yahoo.com</a> &nbsp;·&nbsp; Twitter/X <a href="https://twitter.com/dnkefua" target="_blank">@dnkefua</a> &nbsp;·&nbsp; GitHub <a href="https://github.com/dnkefua" target="_blank">@dnkefua</a><br /><br />
      NDN Analytics Inc. is a founder-led, pre-revenue Oklahoma corporation. This white paper accompanies the IPFS Foundation Grant Application. NDP v1.0 Specification: CC-BY 4.0. Reference implementation: Apache-2.0.
    </p>
  </div>
</footer>
`