import { NavLink } from 'react-router-dom';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import { redirectToCheckout } from '../lib/stripe';

// Tier display config — matches exact pricing and pod limits
const TIER_INFO = {
  free: {
    label: 'Free',
    pods: '0 pods',
    price: 'Free',
    posting: null,
    note: 'No paid pod access.',
  },
  starter: {
    label: 'Starter Pod',
    pods: '1 active pod',
    price: '$89/mo',
    posting: '2 campaign posting days per week',
    note: null,
  },
  growth: {
    label: 'Growth Pods',
    pods: 'Up to 3 active pods',
    price: '$249/mo',
    posting: '3 campaign posting days per week',
    note: 'Extra posting days available as add-ons.',
  },
  pro: {
    label: 'Pro Marketing Pods',
    pods: 'Up to 7 active pods',
    price: '$599/mo',
    posting: '6 campaign posting days per week',
    note: null,
  },
  scale: {
    label: 'Scale / Agency Pods',
    pods: 'Up to 12 active pods',
    price: '$1,299/mo',
    posting: '7 campaign posting days per week',
    note: null,
  },
};

function TierBadge({ tier }) {
  const info = TIER_INFO[tier] || TIER_INFO.free;
  return (
    <article className="panel detail-card" style={{ borderColor: 'var(--gold)' }}>
      <p className="eyebrow">Current plan</p>
      <h3 style={{ fontFamily: "'Playfair Display', serif", margin: '0.25rem 0 0.5rem' }}>
        {info.label}
      </h3>
      <p className="pricing-price" style={{ fontSize: '1.5rem', margin: '0.25rem 0' }}>
        {info.price}
      </p>
      <ul className="simple-list" style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0' }}>
        <li style={{ padding: '0.25rem 0', color: 'var(--navy)' }}>✓ {info.pods}</li>
        {info.posting && (
          <li style={{ padding: '0.25rem 0', color: 'var(--navy)' }}>✓ {info.posting}</li>
        )}
        {info.note && (
          <li style={{ padding: '0.25rem 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
            {info.note}
          </li>
        )}
      </ul>
    </article>
  );
}

function UpgradeOptions({ currentTier }) {
  const tiers = [
    { key: 'starter', ...TIER_INFO.starter },
    { key: 'growth',  ...TIER_INFO.growth },
    { key: 'pro',     ...TIER_INFO.pro },
    { key: 'scale',   ...TIER_INFO.scale },
  ];

  const upgrades = tiers.filter((t) => {
    const order = ['free', 'starter', 'growth', 'pro', 'scale'];
    return order.indexOf(t.key) > order.indexOf(currentTier || 'free');
  });

  if (upgrades.length === 0) return null;

  return (
    <article className="panel detail-card">
      <p className="eyebrow">Upgrade your plan</p>
      <h4>Scale when you are ready.</h4>
      <div className="cards-grid" style={{ marginTop: '1rem' }}>
        {upgrades.map((t) => (
          <div key={t.key} className="panel" style={{ padding: '1rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{t.label}</p>
            <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.5rem' }}>
              {t.price}
            </p>
            <p className="subtle" style={{ marginBottom: '0.5rem' }}>{t.pods}</p>
            {t.posting && (
              <p className="subtle" style={{ marginBottom: '0.75rem' }}>{t.posting}</p>
            )}
            <button
              className="button button-primary"
              type="button"
              onClick={() => redirectToCheckout(t.key, 'monthly')}
            >
              Upgrade to {t.label}
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function AccountPage({ session, subscription }) {
  const user = session?.user;
  const tier = subscription?.tier || 'free';

  const handleSignOut = async () => {
    if (!supabaseConfigured || !supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <div className="page-stack">
      <header className="section-header panel">
        <div>
          <p className="eyebrow">Account</p>
          <h3>Your Dovroyn account</h3>
          <p className="subtle">Manage your subscription, profile, and billing.</p>
        </div>
        <button className="button button-ghost" type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      {/* Profile */}
      <article className="panel detail-card">
        <p className="eyebrow">Profile</p>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div>
            <p className="subtle" style={{ fontSize: '0.8rem', marginBottom: '0.1rem' }}>Email</p>
            <p style={{ fontWeight: 500 }}>{user?.email || '—'}</p>
          </div>
          <div>
            <p className="subtle" style={{ fontSize: '0.8rem', marginBottom: '0.1rem' }}>User ID</p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--muted)' }}>
              {user?.id || '—'}
            </p>
          </div>
        </div>
      </article>

      {/* Subscription */}
      <TierBadge tier={tier} />

      {/* Upgrade options */}
      <UpgradeOptions currentTier={tier} />

      {/* Billing note */}
      {tier !== 'free' && (
        <article className="panel detail-card">
          <p className="eyebrow">Billing</p>
          <h4>Manage your subscription</h4>
          <p className="subtle" style={{ marginTop: '0.5rem' }}>
            To cancel, pause, or update payment details, please contact us at{' '}
            <a href="mailto:support@dovroyn.com" style={{ color: 'var(--gold)' }}>
              support@dovroyn.com
            </a>
            .
          </p>
        </article>
      )}

      {/* Quick links */}
      <article className="panel detail-card">
        <p className="eyebrow">Quick links</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <NavLink className="button button-ghost" to="/pods">My Pods</NavLink>
          <NavLink className="button button-ghost" to="/pricing">Pricing</NavLink>
          <NavLink className="button button-ghost" to="/settings">Settings</NavLink>
        </div>
      </article>
    </div>
  );
}
