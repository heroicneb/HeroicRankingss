import type { ReactNode } from "react";

/**
 * Four screens of the partner portal, redrawn as HTML so they follow the
 * site's light and dark themes (see .portal-mock in globals.css). Everything
 * here is demo copy with fictional agencies and clients; prices are omitted
 * on purpose. Each mock is laid out at a fixed design width and scaled by
 * PortalShowcase, so sizes below are plain pixels.
 */

/* ── Small building blocks ──────────────────────────────────────────── */

function Pill({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "info" | "danger" | "accent"; children: ReactNode }) {
  return <span className={`pm-pill pm-pill-${tone}`}>{children}</span>;
}

function Dot({ tone }: { tone: "success" | "warning" | "info" | "danger" | "accent" }) {
  return <span aria-hidden className={`pm-dot pm-dot-${tone}`} />;
}

function Avatar({ initials, tone = "accent" }: { initials: string; tone?: "accent" | "muted" }) {
  return <span className={`pm-avatar pm-avatar-${tone}`}>{initials}</span>;
}

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg aria-hidden className={`pm-chevron ${open ? "pm-chevron-open" : ""}`} fill="none" viewBox="0 0 12 12">
      <path d="M4 2.5 7.5 6 4 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="m5.3 8.2 1.8 1.8 3.6-3.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.6V8l2.3 1.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7.2v4M8 4.9v.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}

function BubbleIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <path d="M3 3.5h10v7H7.2L4.2 13v-2.5H3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <path d="M8 13.2 3.4 8.7a2.9 2.9 0 0 1 4.1-4.1L8 5.1l.5-.5a2.9 2.9 0 0 1 4.1 4.1z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <path d="M5 7.2v5.6H3.2V7.2zm1.6 5.6h4.6c.6 0 1.1-.4 1.3-1l.9-3.2c.2-.8-.4-1.5-1.2-1.5H9.6l.4-2.3c.1-.6-.3-1.2-.9-1.3L8.6 3.4 6.6 7.2z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden className="pm-ico pm-ico-lg" fill="none" viewBox="0 0 16 16">
      <path d="M4 2h5.5L13 5.5V14H4z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
      <path d="M9.5 2v3.5H13M6 9h4M6 11.5h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <path d="m8 2.5 5 2.6v5.8l-5 2.6-5-2.6V5.1z M3 5.1l5 2.6 5-2.6M8 7.7v5.8" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden className="pm-ico" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 8h12M8 2c2 2.2 2 9.8 0 12M8 2c-2 2.2-2 9.8 0 12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

const NAV_ITEMS = ["Dashboard", "Reports", "Search Analytics", "Finance", "Browse Services", "Campaigns", "My Profile", "Notifications", "Invoices"];

/** Sidebar + top bar shared by every screen. */
function Shell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="pm-shell">
      <aside className="pm-sidebar">
        <div className="pm-brand">
          <span className="pm-brand-mark">A</span>
          <span>
            <span className="pm-brand-name">Agency Portal</span>
            <span className="pm-brand-sub">PARTNER</span>
          </span>
        </div>
        <p className="pm-side-label">Navigation</p>
        <ul className="pm-nav">
          {NAV_ITEMS.map((item) => (
            <li className={item === active ? "pm-nav-active" : undefined} key={item}>
              <span className="pm-nav-ico" />
              {item}
            </li>
          ))}
        </ul>
        <p className="pm-side-label">Create Project</p>
        <ul className="pm-nav">
          <li>
            <span className="pm-nav-ico pm-nav-ico-plus" />
            Add a new project
          </li>
        </ul>
      </aside>
      <div className="pm-main">
        <header className="pm-topbar">
          <span className="pm-topbar-toggle" />
          <Avatar initials="ND" />
          <span className="pm-topbar-title">Welcome, Northstar Digital</span>
          <span className="pm-topbar-right">
            <span className="pm-topbar-demo">Demo data</span>
            <span className="pm-topbar-btn pm-topbar-btn-round" />
            <span className="pm-topbar-btn pm-topbar-btn-round" />
            <span className="pm-topbar-btn">Logout</span>
          </span>
        </header>
        <div className="pm-body">{children}</div>
      </div>
    </div>
  );
}

/* ── Screen 1: Dashboard ────────────────────────────────────────────── */

const PROJECTS = [
  { name: "Atlas Legal", host: "atlas.example.com", active: 1, unread: 0, updated: "2h ago" },
  { name: "Bloom Dental", host: "bloom.example.com", active: 1, unread: 1, updated: "2h ago" },
  { name: "Cedar & Stone", host: "cedar.example.com", active: 2, unread: 2, updated: "12m ago" },
  { name: "Harbor Home", host: "harbor.example.com", active: 0, unread: 0, updated: "2h ago" },
  { name: "Summit Outdoor", host: "summit.example.com", active: 1, unread: 1, updated: "2h ago" },
  { name: "Willow Wellness", host: "willow.example.com", active: 0, unread: 0, updated: "2h ago" },
];

const SERVICES = [
  { title: "Editorial Link Building", body: "Relevant, high-quality editorial placements to strengthen your client's authority." },
  { title: "SEO Content Writing", body: "Search-focused content tailored to your client's services, audience, and target locations." },
  { title: "Technical SEO Audit", body: "A detailed website audit with prioritized, actionable recommendations." },
  { title: "Local SEO Optimization", body: "Improve local search visibility with profile optimization and service-area content." },
];

export function DashboardMock() {
  return (
    <Shell active="Dashboard">
      <div className="pm-page-head">
        <div>
          <h3 className="pm-h1">My Projects</h3>
          <p className="pm-sub">Manage all your projects and deliverables in one place</p>
        </div>
        <div className="pm-actions">
          <span className="pm-btn">Mark all as read (4)</span>
          <span className="pm-btn pm-btn-primary">New Project</span>
        </div>
      </div>

      <div className="pm-stats">
        {[
          ["6", "Total Projects", "neutral"],
          ["5", "Active Tasks", "info"],
          ["3", "Pending Review", "warning"],
          ["2", "Completed", "success"],
        ].map(([n, label, tone]) => (
          <div className="pm-card pm-stat" key={label}>
            <span className={`pm-stat-n pm-text-${tone}`}>{n}</span>
            <span className="pm-stat-l">{label}</span>
            <Chevron open />
          </div>
        ))}
      </div>

      <div className="pm-card pm-block">
        <div className="pm-block-head">
          <span className="pm-block-title">
            Recent Activity <span className="pm-muted">(8)</span>
          </span>
          <span className="pm-btn pm-btn-sm">Show all 8</span>
        </div>
        <ul className="pm-activity">
          <li>
            <span className="pm-text-success">
              <BubbleIcon />
            </span>
            <span>
              <span className="pm-activity-title">
                Service page content refresh <Pill>Cedar &amp; Stone</Pill>
              </span>
              <span className="pm-activity-meta">Comment by Agency · 12m ago</span>
            </span>
          </li>
          <li>
            <span className="pm-text-danger">
              <HeartIcon />
            </span>
            <span>
              <span className="pm-activity-title">
                Patient education article <Pill>Bloom Dental</Pill>
              </span>
              <span className="pm-activity-meta">Northstar Digital reacted with thumbs up · 38m ago</span>
            </span>
          </li>
        </ul>
      </div>

      <div className="pm-card pm-block">
        <div className="pm-block-head">
          <span className="pm-block-title">
            Quick Navigation <span className="pm-muted">(6 projects)</span>
          </span>
          <span className="pm-actions">
            <span className="pm-btn pm-btn-sm">Name A–Z</span>
            <span className="pm-btn pm-btn-sm">Active</span>
          </span>
        </div>
        <div className="pm-projects">
          {PROJECTS.map((p) => (
            <div className="pm-project" key={p.name}>
              {p.unread ? <span className="pm-badge">{p.unread}</span> : null}
              <span className="pm-project-name">{p.name}</span>
              <span className="pm-project-host">
                <GlobeIcon /> {p.host}
              </span>
              <span className="pm-project-row">
                <Pill>active</Pill>
                {p.active ? <span className="pm-text-info pm-xs">{p.active} active</span> : null}
              </span>
              <span className="pm-project-updated">
                <ClockIcon /> Updated {p.updated}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pm-two-col">
        <div className="pm-card pm-block">
          <div className="pm-block-head">
            <span className="pm-block-title">Monthly Deliverables</span>
            <span className="pm-btn pm-btn-sm">May 2026</span>
          </div>
          <ul className="pm-tree">
            <li className="pm-tree-group">
              <Chevron open /> <BoxIcon /> <strong>Cedar &amp; Stone</strong>
              <span className="pm-tree-counts">
                <span className="pm-text-info">2 active</span> <span className="pm-text-warning">1 pending</span> <span className="pm-text-success">1 done</span>
              </span>
            </li>
            <li className="pm-tree-item">
              <ClockIcon /> <Dot tone="danger" /> Service page content refresh <Pill tone="info">In Progress</Pill>
            </li>
            <li className="pm-tree-item">
              <CheckIcon /> Editorial link placements <Pill tone="accent">Approved</Pill>
            </li>
            <li className="pm-tree-item">
              <CheckIcon /> Technical SEO audit <Pill tone="success">Done</Pill>
            </li>
            <li className="pm-tree-item">
              <InfoIcon /> Local landing page brief <Pill>Proposed</Pill>
            </li>
            {[
              ["Bloom Dental", "1 active · 1 pending"],
              ["Summit Outdoor", "1 active"],
              ["Atlas Legal", "1 active"],
              ["Harbor Home", "1 pending"],
            ].map(([name, counts]) => (
              <li className="pm-tree-group" key={name}>
                <Chevron /> <BoxIcon /> <strong>{name}</strong>
                <span className="pm-tree-counts pm-text-info">{counts}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pm-card pm-block">
          <div className="pm-block-head">
            <span className="pm-block-title">
              <BoxIcon /> Quick Services
            </span>
          </div>
          <div className="pm-services">
            {SERVICES.map((s) => (
              <div className="pm-service" key={s.title}>
                <span className="pm-service-title">{s.title}</span>
                <span className="pm-service-body">{s.body}</span>
                <span className="pm-link">Learn More →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ── Shared project header (screens 2 and 4) ────────────────────────── */

function ProjectHeader() {
  return (
    <>
      <div className="pm-page-head">
        <div>
          <h3 className="pm-h1">Cedar &amp; Stone</h3>
          <p className="pm-link pm-sub">https://cedar.example.com ↗</p>
          <p className="pm-badges">
            <Pill tone="success">Active</Pill> <Pill tone="danger">2 unread</Pill>
          </p>
        </div>
        <div className="pm-actions">
          <span className="pm-btn pm-btn-icon">T</span>
          <span className="pm-btn pm-btn-icon">⤡</span>
          <span className="pm-btn">View Project</span>
        </div>
      </div>
      <div className="pm-stats pm-stats-3">
        {[
          ["2", "Active", "info"],
          ["1", "Pending", "warning"],
          ["1", "Done", "success"],
        ].map(([n, label, tone]) => (
          <div className="pm-card pm-stat pm-stat-center" key={label}>
            <span className={`pm-stat-n pm-text-${tone}`}>{n}</span>
            <span className="pm-stat-l">{label}</span>
          </div>
        ))}
      </div>
      <div className="pm-block-head pm-deliverables-head">
        <span className="pm-block-title">Deliverables (4)</span>
        <span className="pm-actions">
          <span className="pm-btn pm-btn-sm">↗ Browse Services</span>
          <span className="pm-btn pm-btn-sm pm-btn-primary">+ Add</span>
        </span>
      </div>
      <p className="pm-month">
        May 2026 <span className="pm-muted">(4)</span>
      </p>
    </>
  );
}

function Meta({ hours }: { hours: string }) {
  return (
    <div className="pm-meta">
      <span className="pm-chip">
        <ClockIcon /> {hours} estimated
      </span>
      <span className="pm-chip">2026-05</span>
    </div>
  );
}

/* ── Screen 2: Deliverable thread ───────────────────────────────────── */

export function ThreadMock() {
  return (
    <Shell active="Dashboard">
      <ProjectHeader />
      <div className="pm-card pm-deliverable pm-deliverable-open">
        <div className="pm-deliverable-row">
          <Chevron open /> <span className="pm-text-info"><ClockIcon /></span>
          <strong>Service page content refresh</strong> <span className="pm-badge pm-badge-inline">2</span> <Pill tone="warning">High</Pill> <Pill tone="info">In Progress</Pill>
        </div>
        <div className="pm-desc">Refresh the kitchen and bathroom remodeling pages with updated service copy, local search intent, and internal links.</div>
        <Meta hours="6h" />
        <div className="pm-block-head pm-comments-head">
          <span className="pm-block-title">
            <BubbleIcon /> Comments (3)
          </span>
          <span className="pm-btn pm-btn-sm">Mark unread</span>
        </div>
        <div className="pm-thread">
          <div className="pm-msg">
            <Avatar initials="A" />
            <div className="pm-bubble pm-bubble-agency">
              <div className="pm-msg-head">
                <strong>Agency</strong> <Pill tone="accent">agency</Pill> <span className="pm-msg-date">5/12/2026</span>
              </div>
              <p>The revised service page copy is ready for review. We&apos;ve focused the kitchen page on renovation intent and added clearer calls to action. The review document is attached.</p>
              <div className="pm-attachment">
                <span className="pm-attachment-file">
                  <FileIcon />
                  <span>
                    <span className="pm-attachment-name">cedar-service-page-copy.pdf</span>
                    <span className="pm-attachment-type">PDF</span>
                  </span>
                </span>
                <span className="pm-attachment-dl">⤓ Download</span>
              </div>
              <span className="pm-reaction">
                <ThumbIcon /> 2
              </span>
            </div>
          </div>
          <div className="pm-msg pm-msg-right">
            <div className="pm-bubble pm-bubble-partner">
              <div className="pm-msg-head">
                <strong>Northstar Digital</strong> <Pill tone="info">partner</Pill> <span className="pm-msg-date">5/12/2026</span>
              </div>
              <p>Thanks! The client likes the new direction. Could we keep &ldquo;design consultation&rdquo; in the main CTA and add a mention of custom cabinetry?</p>
              <span className="pm-reaction pm-reaction-right">✓ 1</span>
            </div>
            <Avatar initials="ND" />
          </div>
          <div className="pm-msg">
            <Avatar initials="A" />
            <div className="pm-bubble pm-bubble-agency">
              <div className="pm-msg-head">
                <strong>Agency</strong> <Pill tone="accent">agency</Pill> <span className="pm-msg-date">5/13/2026</span>
              </div>
              <p>
                Absolutely. Both updates are included in the final draft. We also added the internal links from the project brief.
                <br />
                Preview: <span className="pm-link pm-underline">https://cedar.example.com/kitchen-remodeling</span>
              </p>
              <span className="pm-reaction">
                <HeartIcon /> 1
              </span>
            </div>
          </div>
        </div>
        <div className="pm-composer">
          <div className="pm-composer-box">Type a message…</div>
          <div className="pm-composer-row">
            <span className="pm-btn pm-btn-icon pm-btn-sm">⊕</span>
            <span className="pm-btn pm-btn-icon pm-btn-sm">⛓</span>
            <span className="pm-muted pm-xs">Enter to send · Shift+Enter for new line</span>
            <span className="pm-btn pm-btn-primary pm-btn-sm pm-composer-send">Send</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ── Screen 3: Reports ──────────────────────────────────────────────── */

const KEYWORDS = [
  { kw: "cedar and stone remodeling", rank: 2, vol: "260", url: "cedarandstone.example/", m: "+1", w: "0", d: "0", top: "success" },
  { kw: "kitchen remodeling portland", rank: 5, vol: "1K", url: "cedarandstone.example/kitchens", m: "+4", w: "+1", d: "0", top: "info" },
  { kw: "bathroom renovation portland", rank: 8, vol: "880", url: "cedarandstone.example/bathrooms", m: "+3", w: "+1", d: "0", top: "info" },
  { kw: "home renovation portland", rank: 14, vol: "2K", url: "cedarandstone.example/renovations", m: "-1", w: "0", d: "0", top: "neutral" },
];

export function ReportsMock() {
  return (
    <Shell active="Reports">
      <div className="pm-page-head">
        <div>
          <h3 className="pm-h1">Reports</h3>
          <p className="pm-sub">View your project reports and analytics</p>
        </div>
      </div>
      <div className="pm-report-controls">
        <span className="pm-select">Cedar &amp; Stone</span>
        <span className="pm-btn pm-btn-icon">‹</span>
        <span className="pm-btn pm-btn-month">September 2026</span>
        <span className="pm-btn pm-btn-icon">›</span>
      </div>
      <p className="pm-muted pm-report-for">Report for Cedar &amp; Stone – September 2026</p>
      <p className="pm-report-p">September brought stronger visibility for Cedar &amp; Stone&apos;s kitchen and bathroom remodeling services. Organic clicks grew 18.4% month over month, with service-page improvements helping more local homeowners discover the business.</p>
      <p className="pm-report-p">We completed the priority on-page and technical work below. In October, we&apos;ll build on this progress with neighborhood landing pages and a new project case study.</p>
      <p className="pm-report-client">
        <strong>Cedar &amp; Stone</strong>
        <span className="pm-muted pm-xs">September 1–30, 2026 · cedarandstone.example</span>
      </p>
      <p className="pm-eyebrow">Completed deliverables (3)</p>
      <ul className="pm-done-list">
        {[
          ["Optimized kitchen and bathroom remodeling service pages", "Updated titles, headings, FAQs and internal links across 6 priority pages.", "6 hrs"],
          ["Resolved technical SEO issues", "Fixed 12 broken internal links and added LocalBusiness structured data.", "4 hrs"],
          ["Published a kitchen renovation planning guide", "Created an original 1,400-word guide with links to relevant services.", "5 hrs"],
        ].map(([title, body, hrs]) => (
          <li className="pm-card pm-done" key={title}>
            <Dot tone="success" />
            <span>
              <span className="pm-done-title">{title}</span>
              <span className="pm-done-body">{body}</span>
            </span>
            <span className="pm-done-hrs">{hrs}</span>
          </li>
        ))}
      </ul>
      <p className="pm-total">Total: 15 hours</p>
      <p className="pm-badges">
        <Pill>4 tracked</Pill> <Pill tone="success">1 in Top 3</Pill> <Pill tone="info">3 in Top 10</Pill> <Pill>4 in Top 20</Pill>
      </p>
      <table className="pm-table">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Rank</th>
            <th>Search Volume</th>
            <th>Result URL</th>
            <th>Monthly</th>
            <th className="pm-col-opt">Weekly</th>
            <th className="pm-col-opt">Daily</th>
          </tr>
        </thead>
        <tbody>
          {KEYWORDS.map((k) => (
            <tr key={k.kw}>
              <td>{k.kw}</td>
              <td className={`pm-rank pm-text-${k.top}`}>{k.rank}</td>
              <td>{k.vol}</td>
              <td className="pm-muted">{k.url}</td>
              <td>
                <Pill tone={k.m.startsWith("-") ? "danger" : "success"}>{k.m.startsWith("-") ? "↘" : "↗"} {k.m.replace(/^[+-]/, "")}</Pill>
              </td>
              <td className="pm-col-opt">{k.w === "0" ? <span className="pm-muted">0</span> : <Pill tone="success">↗ {k.w.replace("+", "")}</Pill>}</td>
              <td className="pm-col-opt pm-muted">{k.d}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="pm-muted pm-xs pm-right">4 / 4 keywords shown</p>
    </Shell>
  );
}

/* ── Screen 4: Deliverables list ────────────────────────────────────── */

export function DeliverablesMock() {
  return (
    <Shell active="Dashboard">
      <ProjectHeader />
      <div className="pm-card pm-deliverable">
        <div className="pm-deliverable-row">
          <Chevron /> <span className="pm-text-info"><ClockIcon /></span>
          <strong>Service page content refresh</strong> <span className="pm-badge pm-badge-inline">2</span> <Pill tone="warning">High</Pill> <Pill tone="info">In Progress</Pill>
        </div>
      </div>
      <div className="pm-card pm-deliverable">
        <div className="pm-deliverable-row">
          <Chevron /> <span className="pm-text-success"><CheckIcon /></span>
          <strong>Editorial link placements</strong> <Pill tone="warning">Medium</Pill> <Pill tone="success">Approved</Pill>
        </div>
      </div>
      <div className="pm-card pm-deliverable pm-deliverable-open">
        <div className="pm-deliverable-row">
          <Chevron open /> <span className="pm-text-success"><CheckIcon /></span>
          <strong>Technical SEO audit</strong> <Pill tone="warning">High</Pill> <Pill tone="success">Done</Pill>
        </div>
        <div className="pm-desc">Review crawlability, indexation, structured data, and Core Web Vitals. Audit and prioritized recommendations delivered.</div>
        <Meta hours="4h" />
        <div className="pm-block-head pm-comments-head">
          <span className="pm-block-title">
            <BubbleIcon /> Comments (0)
          </span>
        </div>
        <p className="pm-empty">No comments yet. Start the conversation!</p>
      </div>
      <div className="pm-card pm-deliverable">
        <div className="pm-deliverable-row">
          <Chevron /> <span className="pm-text-accent"><InfoIcon /></span>
          <strong>Local landing page brief</strong> <Pill tone="warning">Medium</Pill> <Pill tone="accent">Proposed</Pill>
        </div>
      </div>
    </Shell>
  );
}

export const PORTAL_SCREENS = [
  { id: "dashboard", crumb: "Dashboard", Mock: DashboardMock },
  { id: "thread", crumb: "Cedar & Stone · Deliverable", Mock: ThreadMock },
  { id: "reports", crumb: "Reports · September 2026", Mock: ReportsMock },
  { id: "deliverables", crumb: "Cedar & Stone · Deliverables", Mock: DeliverablesMock },
] as const;
