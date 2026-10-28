import Link from 'next/link';

export const CONTACT = 'hello@apexhuman.ai';
export const UPDATED = '28 October 2026';

/** Plain text page for the terms and the privacy policy. Platforms link to these in app review. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: '#18181b', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px', fontSize: 15, lineHeight: 1.65 }}>
        <Link href="/" style={{ color: '#006AFF', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          ← AI Influencer Agency
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: '24px 0 4px' }}>{title}</h1>
        <p style={{ color: '#71717a', margin: '0 0 32px' }}>Last updated {UPDATED}</p>
        <div className="legal">{children}</div>
      </div>
    </main>
  );
}
