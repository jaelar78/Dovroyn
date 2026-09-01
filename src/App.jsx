import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle,
  Megaphone,
  PenTool,
  Calendar,
  BarChart3,
  Rocket,
  Sparkles,
  Upload,
  Brain,
  Dna,
  Gift,
  PartyPopper,
  DollarSign,
  StickyNote,
  Mail,
  MapPin,
  Plus,
  Globe2,
  Lock,
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
  FaPinterestP,
  FaSnapchat,
  FaRedditAlien,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaThreads,
  FaWeixin,
  FaLine,
  FaSpotify,
  FaAmazon,
  FaMeta,
  FaMicrosoft,
  FaGoogle,
  FaApple,
  FaMedium,
  FaTumblr,
  FaMastodon,
  FaTwitch,
  FaCommentSms,
  FaWordpress,
} from 'react-icons/fa6';
import { SiGoogleads, SiApplenews, SiNextdoor, SiBluesky, SiSubstack } from 'react-icons/si';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import { supabase, supabaseConfigured } from './lib/supabaseClient';
import Header from './components/Header';
import BrandLogo from './components/BrandLogo';
import Footer from './components/Footer';
import TesterPodPreview from './components/TesterPodPreview';
import AiPodAssistant from './components/AiPodAssistant';
import PodsPage from './pages/Pods';
import NewPodPage from './pages/NewPod';
import AccountPage from './pages/Account';
import PodWorkspace from './pages/PodWorkspace';

const APP_NAME = 'Dovroyn';
const APP_DOMAIN = 'dovroyn.com';

const STRIPE_PRICING_LINKS = {
  starter_monthly: import.meta.env.VITE_STRIPE_STARTER_MONTHLY || null,
  starter_yearly: import.meta.env.VITE_STRIPE_STARTER_YEARLY || null,
  growth_monthly: import.meta.env.VITE_STRIPE_GROWTH_MONTHLY || null,
  growth_yearly: import.meta.env.VITE_STRIPE_GROWTH_YEARLY || null,
  pro_monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY || null,
  pro_yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY || null,
  scale_monthly: import.meta.env.VITE_STRIPE_SCALE_MONTHLY || null,
  scale_yearly: import.meta.env.VITE_STRIPE_SCALE_YEARLY || null,
};

const LANDING_SECTIONS = [
  {
    heading: "Analyse your website, offer, or campaign.",
    body: "Drop in a website, app, offer, or teaser images. Dovroyn reads the source, understands the brand, and builds a clear marketing direction inside a dedicated AI pod.",
  },
  {
    heading: "Lock in the direction before anything goes live.",
    body: "Accept the AI's strategy or push back with your own choice. Once approved, every content idea, ad angle, calendar post, and campaign move follows that locked-in tone.",
  },
  {
    heading: "Plan campaigns for the platforms that matter.",
    body: "Dovroyn recommends the best social, search, content, and community platforms for your campaign. Posting and ads require the user to connect each account and approve permissions first.",
  },
];

const DASHBOARD_PREVIEW_CARDS = [
  { title: 'Website analysed', metric: 'Ready', description: 'Brand, offer, audience, and tone extracted from the source.' },
  { title: 'Campaign direction', metric: 'Locked', description: 'The approved strategy controls all content, ads, and calendar suggestions.' },
  { title: 'Content calendar', metric: 'Generated', description: 'Posts planned around the pod, selected platforms, paid tier, and target country.' },
  { title: 'Socials connected', metric: 'Pending', description: 'Connect each platform securely before posting or ad permissions are enabled.' },
  { title: 'Budget tracker', metric: 'Active', description: 'Track planned spend, used spend, leads, sales, and return.' },
  { title: 'Ad improvement', metric: 'Needs approval', description: 'AI suggestions are shown for review before anything changes.' },
];

const MULTI_POD_CARDS = [
  {
    name: 'Summit Trail Co',
    slug: 'summit-trail-co',
    type: 'Brand Pod',
    status: 'AI Brain Active',
    contentCount: '18 ideas',
    calendarCount: '12 posts',
    avatarInitials: 'JW',
    avatarGradient: 'linear-gradient(135deg, #B88A32, #E0C070)',
    platforms: [
      { name: 'Instagram', icon: FaInstagram, color: '#E1306C' },
      { name: 'TikTok', icon: FaTiktok, color: '#0F1419' },
      { name: 'Pinterest', icon: FaPinterestP, color: '#E60023' },
      { name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
    ],
  },
  {
    name: 'House of MGNM',
    slug: 'house-of-mgnm',
    type: 'Campaign Pod',
    status: 'Launch Campaign Ready',
    contentCount: '9 angles',
    calendarCount: '6 dates',
    avatarInitials: 'MD',
    avatarGradient: 'linear-gradient(135deg, #07162D, #2E4A73)',
    platforms: [
      { name: 'Instagram', icon: FaInstagram, color: '#E1306C' },
      { name: 'Pinterest', icon: FaPinterestP, color: '#E60023' },
      { name: 'LinkedIn', icon: FaLinkedinIn, color: '#0A66C2' },
    ],
  },
  {
    name: 'Luxara',
    slug: 'luxara',
    type: 'Jewellery Pod',
    status: 'Collection Plan Ready',
    contentCount: '14 assets',
    calendarCount: '7 days',
    avatarInitials: 'AL',
    avatarGradient: 'linear-gradient(135deg, #6B4E8E, #A98BC9)',
    platforms: [
      { name: 'Instagram', icon: FaInstagram, color: '#E1306C' },
      { name: 'Google Ads', icon: SiGoogleads, color: '#4285F4' },
      { name: 'Email', icon: Mail, color: '#B88A32' },
    ],
  },
  {
    name: 'Cheeky Drawers',
    slug: 'cheeky-drawers',
    type: 'Social Pod',
    status: 'Social Hooks Ready',
    contentCount: '21 hooks',
    calendarCount: '15 posts',
    avatarInitials: 'RB',
    avatarGradient: 'linear-gradient(135deg, #C2563B, #E8926F)',
    platforms: [
      { name: 'TikTok', icon: FaTiktok, color: '#0F1419' },
      { name: 'Instagram', icon: FaInstagram, color: '#E1306C' },
      { name: 'X / Twitter', icon: FaXTwitter, color: '#0F1419' },
    ],
  },
  {
    name: 'The Cleaning Hub',
    slug: 'the-cleaning-hub',
    type: 'Business Pod',
    status: 'Local Growth Ready',
    contentCount: '11 ideas',
    calendarCount: '8 slots',
    avatarInitials: 'SK',
    avatarGradient: 'linear-gradient(135deg, #2E7D4F, #6FBE8F)',
    platforms: [
      { name: 'Facebook', icon: FaFacebookF, color: '#1877F2' },
      { name: 'Google Ads', icon: SiGoogleads, color: '#4285F4' },
      { name: 'Local / Search', icon: MapPin, color: '#2E7D4F' },
    ],
  },
];

const PLATFORMS = [
  { name: 'Facebook', icon: FaFacebookF, focus: 'Social planning' },
  { name: 'Instagram', icon: FaInstagram, focus: 'Visual content' },
  { name: 'TikTok', icon: FaTiktok, focus: 'Short-form video' },
  { name: 'Google Ads', icon: SiGoogleads, focus: 'Search & ads' },
  { name: 'YouTube', icon: FaYoutube, focus: 'Video campaigns' },
  { name: 'LinkedIn', icon: FaLinkedinIn, focus: 'B2B outreach' },
  { name: 'X / Twitter', icon: FaXTwitter, focus: 'Conversation' },
  { name: 'Pinterest', icon: FaPinterestP, focus: 'Discovery boards' },
  { name: 'Snapchat', icon: FaSnapchat, focus: 'Youth reach' },
  { name: 'Reddit', icon: FaRedditAlien, focus: 'Community angles' },
  { name: 'WhatsApp', icon: FaWhatsapp, focus: 'Direct messaging' },
  { name: 'Telegram', icon: FaTelegram, focus: 'Broadcast channels' },
  { name: 'Discord', icon: FaDiscord, focus: 'Community hubs' },
  { name: 'Threads', icon: FaThreads, focus: 'Social conversation' },
  { name: 'WeChat', icon: FaWeixin, focus: 'Regional reach' },
  { name: 'LINE', icon: FaLine, focus: 'Regional messaging' },
  { name: 'Spotify', icon: FaSpotify, focus: 'Audio ads' },
  { name: 'Amazon Ads', icon: FaAmazon, focus: 'Retail ads' },
  { name: 'Apple News', icon: SiApplenews, focus: 'Editorial reach' },
  { name: 'Nextdoor', icon: SiNextdoor, focus: 'Local reach' },
  { name: 'YouTube Shorts', icon: FaYoutube, focus: 'Vertical video' },
  { name: 'Meta Ads', icon: FaMeta, focus: 'Paid social planning' },
  { name: 'LinkedIn Ads', icon: FaLinkedinIn, focus: 'B2B paid reach' },
  { name: 'TikTok Ads', icon: FaTiktok, focus: 'Native video ads' },
  { name: 'Pinterest Ads', icon: FaPinterestP, focus: 'Paid discovery' },
  { name: 'Microsoft Ads', icon: FaMicrosoft, focus: 'Search campaigns' },
  { name: 'Google Business Profile', icon: FaGoogle, focus: 'Local discovery' },
  { name: 'Apple Podcasts', icon: FaApple, focus: 'Podcast discovery' },
  { name: 'Substack', icon: SiSubstack, focus: 'Newsletters' },
  { name: 'Medium', icon: FaMedium, focus: 'Long-form content' },
  { name: 'Tumblr', icon: FaTumblr, focus: 'Visual communities' },
  { name: 'Mastodon', icon: FaMastodon, focus: 'Federated social' },
  { name: 'Bluesky', icon: SiBluesky, focus: 'Open conversation' },
  { name: 'Twitch', icon: FaTwitch, focus: 'Live communities' },
  { name: 'SMS', icon: FaCommentSms, focus: 'Direct response' },
  { name: 'Website Blog', icon: FaWordpress, focus: 'Owned search content' },
];

const PRICING_TIERS = [
  {
    name: 'Free',
    monthly: '$0',
    yearly: '$0',
    bestFor: 'Best for trying Dovroyn with one brand or idea.',
    features: [
      '1 active pod',
      'Website or image analysis',
      'AI brand/tone summary',
      'Audience and offer direction',
      'Campaign angles',
      '1 campaign posting day per week',
      'Manual budget tracking',
      'Core pod workspace',
    ],
    stripeKey: null,
    highlight: false,
  },
  {
    name: 'Starter Pod',
    monthly: '$89',
    yearly: '$855',
    bestFor: 'Best for one brand, launch, or campaign.',
    features: [
      '1 active pod',
      'Website or image analysis',
      'AI brand/tone summary',
      'Audience and offer direction',
      'Campaign angles',
      '2 campaign posting days per week',
      'Manual budget tracking',
      'Core pod workspace',
    ],
    stripeKey: 'starter',
  },
  {
    name: 'Growth Pods',
    monthly: '$249',
    yearly: '$2,390',
    bestFor: 'Best for small businesses and creators with multiple offers.',
    features: [
      'Up to 3 active pods',
      'Website/app/image analysis',
      'Campaign strategy',
      'Social platform recommendations',
      '3 campaign posting days per week',
      'Holiday-aware calendar planning',
      'Budget tracking',
      'Ad analysis preview',
      'Extra posting days available as add-ons',
    ],
    stripeKey: 'growth',
  },
  {
    name: 'Pro Marketing Pods',
    monthly: '$599',
    yearly: '$5,750',
    bestFor: 'Best for brands running multiple campaigns.',
    features: [
      'Up to 7 active pods',
      'Full pod analysis',
      'Launch planning',
      'Content calendar generation',
      '6 campaign posting days per week',
      'Budget dashboard',
      'Ad analysis dashboard',
      'Approval workflow for AI recommendations',
    ],
    stripeKey: 'pro',
  },
  {
    name: 'Scale / Agency Pods',
    monthly: '$1,299',
    yearly: '$12,470',
    bestFor: 'Best for agencies, teams, or users managing many brands.',
    features: [
      'Up to 12 active pods',
      'Multi-brand campaign planning',
      'Advanced calendar generation',
      '7 campaign posting days per week',
      'Budget and performance tracking',
      'Ad analysis recommendations',
      'Priority support',
      'Founder support',
    ],
    stripeKey: 'scale',
  },
];

const PRICING_PAGE_TIERS = [
  {
    name: 'Free',
    monthly: '$0',
    yearly: '$0',
    bestFor: 'Best for trying Dovroyn with one brand or idea.',
    features: [
      '1 active pod',
      'Website or image analysis',
      'AI brand/tone summary',
      'Audience and offer direction',
      'Campaign angles',
      '1 campaign posting day per week',
      'Manual budget tracking',
      'Core pod workspace',
    ],
    stripeKey: null,
    highlight: false,
  },
  {
    name: 'Starter Pod',
    monthly: '$89',
    yearly: '$855',
    bestFor: 'Best for one brand, launch, or campaign.',
    features: [
      '1 active pod',
      'Website or image analysis',
      'AI brand/tone summary',
      'Audience and offer direction',
      'Campaign angles',
      '2 campaign posting days per week',
      'Manual budget tracking',
      'Core pod workspace',
    ],
    stripeKey: 'starter',
  },
  {
    name: 'Growth Pods',
    monthly: '$249',
    yearly: '$2,390',
    bestFor: 'Best for small businesses and creators with multiple offers.',
    features: [
      'Up to 3 active pods',
      'Website/app/image analysis',
      'Campaign strategy',
      'Social platform recommendations',
      '3 campaign posting days per week',
      'Holiday-aware calendar planning',
      'Budget tracking',
      'Ad analysis preview',
      'Extra posting days available as add-ons',
    ],
    stripeKey: 'growth',
  },
  {
    name: 'Pro Marketing Pods',
    monthly: '$599',
    yearly: '$5,750',
    bestFor: 'Best for brands running multiple campaigns.',
    features: [
      'Up to 7 active pods',
      'Full pod analysis',
      'Launch planning',
      'Content calendar generation',
      '6 campaign posting days per week',
      'Budget dashboard',
      'Ad analysis dashboard',
      'Approval workflow for AI recommendations',
    ],
    stripeKey: 'pro',
  },
  {
    name: 'Scale / Agency Pods',
    monthly: '$1,299',
    yearly: '$12,470',
    bestFor: 'Best for agencies, teams, or users managing many brands.',
    features: [
      'Up to 12 active pods',
      'Multi-brand campaign planning',
      'Advanced calendar generation',
      '7 campaign posting days per week',
      'Budget and performance tracking',
      'Ad analysis recommendations',
      'Priority support',
      'Founder support',
    ],
    stripeKey: 'scale',
  },
];

const POD_TABS = [
  'Overview', 'Source', 'AI Analysis', 'Brand DNA', 'Audience', 'Offer',
  'Campaign Strategy', 'Content Ideas', 'Ad Angles', 'Socials', 'Calendar',
  'Holidays', 'Budget', 'Ad Analysis', 'AI Notes', 'Next Moves',
];

const SIDEBAR_NAV_ITEMS = [
  { to: '/pods', label: 'Pods' },
  { to: '/pods/new', label: 'Create Pod' },
  { to: '/account', label: 'Account' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/settings', label: 'Settings' },
];

/* ─── SHARED POD TABS COMPONENT ─── */
function PodTabsView({ pod }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [directionAccepted, setDirectionAccepted] = useState(pod?.status === 'direction_locked' || pod?.status === 'active');
  const [userDirection, setUserDirection] = useState('');

  const podData = pod || {
    pod_name: 'Aurora Skincare Launch',
    pod_type: 'website',
    source_url: 'https://auroraskincare.co',
    target_country: 'Australia',
    accepted_tone: 'Expert, reassuring, modern luxury',
    status: 'awaiting_direction',
  };

  const handleAcceptDirection = async () => {
    setDirectionAccepted(true);
    if (supabaseConfigured && pod?.id) {
      await supabase.from('pods').update({
        status: 'direction_locked',
        accepted_tone: userDirection || 'Expert, reassuring, modern luxury',
        accepted_strategy: 'AI-recommended strategy accepted',
        updated_at: new Date().toISOString(),
      }).eq('id', pod.id);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="pod-section-content">
            <h4>Pod: {podData.pod_name}</h4>
            <p><strong>Pod type:</strong> {podData.pod_type}</p>
            <p><strong>Status:</strong> {directionAccepted ? 'Direction locked' : 'Awaiting direction approval'}</p>
            <p><strong>Goal:</strong> Increase qualified leads and repeat purchases</p>
            <p><strong>Target country:</strong> {podData.target_country}</p>
            <p><strong>Current stage:</strong> {directionAccepted ? 'Content planning' : 'Strategy review'}</p>
            <p><strong>Next best marketing move:</strong> Launch hydration-focused ad set to warm traffic</p>
          </div>
        );
      case 'Source':
        return (
          <div className="pod-section-content">
            <h4>Source / Intake</h4>
            <p><strong>Website URL:</strong> {podData.source_url || 'Not provided'}</p>
            <p><strong>Uploaded images:</strong> 3 product photos, 1 lifestyle shot</p>
            <p><strong>Campaign notes:</strong> Winter barrier repair campaign targeting existing customers</p>
            <p><strong>Offer notes:</strong> Bundle discount on night serum + moisturiser</p>
            <p><strong>Product notes:</strong> Serums, moisturisers, seasonal treatment bundles</p>
          </div>
        );
      case 'AI Analysis':
        return (
          <div className="pod-section-content">
            <h4>AI Analysis</h4>
            <p><strong>What the website is about:</strong> Premium skincare brand focused on clean anti-ageing routines for women 24-40</p>
            <p><strong>What is being sold:</strong> Serums, moisturisers, and seasonal treatment bundles</p>
            <p><strong>Brand direction:</strong> Editorial minimalist with botanical luxury cues</p>
            <p><strong>What the customer wants:</strong> Simple, effective routines that feel premium without complexity</p>
            <p><strong>Strongest opportunity:</strong> Hydration-focused messaging outperforms anti-ageing claims by 27%</p>
            {!directionAccepted && (
              <div className="direction-actions">
                <button className="button button-primary" onClick={handleAcceptDirection}>
                  Accept AI Direction
                </button>
                <button className="button button-ghost" onClick={() => setActiveTab('Brand DNA')}>
                  Change Direction
                </button>
              </div>
            )}
            {directionAccepted && <p className="status-chip-gold">Direction accepted and locked</p>}
          </div>
        );
      case 'Brand DNA':
        return (
          <div className="pod-section-content">
            <h4>Brand DNA</h4>
            <p><strong>Brand summary:</strong> Premium skincare for modern women who value efficacy and elegance</p>
            <p><strong>Tone of voice:</strong> {podData.accepted_tone || 'Expert, reassuring, modern luxury'}</p>
            <p><strong>Brand personality:</strong> Confident, knowledgeable, warm</p>
            <p><strong>Visual/style notes:</strong> Soft lighting, close-up textures, botanical elements</p>
            <p><strong>Words to use:</strong> Nourish, restore, glow, ritual, radiance</p>
            <p><strong>Words to avoid:</strong> Cheap, basic, quick fix, miracle</p>
            <p><strong>Locked-in tone:</strong> {directionAccepted ? (podData.accepted_tone || 'Expert luxury') : 'Pending approval'}</p>
            {!directionAccepted && (
              <div style={{ marginTop: '0.8rem' }}>
                <label>
                  Your preferred direction (optional):
                  <textarea
                    rows={3}
                    value={userDirection}
                    onChange={(e) => setUserDirection(e.target.value)}
                    placeholder="e.g. Make it cheeky and bold instead of luxury..."
                  />
                </label>
                <button className="button button-primary" style={{ marginTop: '0.5rem' }} onClick={handleAcceptDirection}>
                  Lock In This Direction
                </button>
              </div>
            )}
          </div>
        );
      case 'Audience':
        return (
          <div className="pod-section-content">
            <h4>Audience</h4>
            <p><strong>Ideal customer:</strong> Women 24-40, urban professionals, value premium skincare</p>
            <p><strong>Pain points:</strong> Overwhelmed by options, worried about ageing, want simple routines</p>
            <p><strong>Desires:</strong> Glowing skin, confidence, feeling put-together without complexity</p>
            <p><strong>Objections:</strong> Price concerns, already have a routine, unsure what works</p>
            <p><strong>Buying triggers:</strong> Before/after results, expert endorsement, limited offers</p>
            <p><strong>Where they are online:</strong> Instagram, TikTok, Pinterest, beauty blogs</p>
            <p><strong>What they need to hear:</strong> Science-backed, visible results in weeks, simple to use</p>
          </div>
        );
      case 'Offer':
        return (
          <div className="pod-section-content">
            <h4>Offer</h4>
            <p><strong>Product:</strong> Winter Barrier Repair Bundle (Night Serum + Moisturiser)</p>
            <p><strong>Price:</strong> $89 bundle (save $24)</p>
            <p><strong>Main angle:</strong> Protect your skin barrier before winter strips it</p>
            <p><strong>Bonuses:</strong> Free travel-size cleanser with bundle</p>
            <p><strong>Urgency:</strong> Winter stock limited, seasonal bundle ends in 14 days</p>
            <p><strong>Why act now:</strong> Prevention is easier than repair \u2014 start before the cold hits</p>
            <p><strong>CTA:</strong> Get Your Winter Bundle</p>
          </div>
        );
      case 'Campaign Strategy':
        return (
          <div className="pod-section-content">
            <h4>Campaign Strategy</h4>
            <p><strong>Main goal:</strong> Drive bundle sales to existing warm audience</p>
            <p><strong>Campaign message:</strong> Your skin barrier needs protection before winter, not after</p>
            <p><strong>Launch angle:</strong> Seasonal urgency + education</p>
            <p><strong>Content theme:</strong> Hydration science meets cosy winter ritual</p>
            <p><strong>Funnel direction:</strong> Awareness reel \u2192 Education carousel \u2192 Bundle offer \u2192 Retarget</p>
            <p><strong>Best channels:</strong> Instagram Reels, Meta Ads, Email</p>
            <p><strong>What to test first:</strong> Hydration hooks vs barrier repair hooks in ad creative</p>
          </div>
        );
      case 'Content Ideas':
        return (
          <div className="pod-section-content">
            <h4>Content Ideas</h4>
            <p><strong>Social posts:</strong></p>
            <ul className="simple-list compact-list">
              <li>Before/after hydration reel with derm-backed caption</li>
              <li>Myth-busting carousel on retinol and barrier repair</li>
              <li>Founder story short video with product stack CTA</li>
            </ul>
            <p><strong>Reel/TikTok ideas:</strong></p>
            <ul className="simple-list compact-list">
              <li>"Your evening routine is missing one recovery step"</li>
              <li>"3 signs your barrier is already damaged"</li>
            </ul>
            <p><strong>Email ideas:</strong></p>
            <ul className="simple-list compact-list">
              <li>Winter prep sequence: 3 emails over 5 days</li>
              <li>Bundle launch announcement with early-bird bonus</li>
            </ul>
            <p><strong>Hook bank:</strong></p>
            <ul className="simple-list compact-list">
              <li>"Your moisturiser is not enough for winter"</li>
              <li>"3 signs your barrier is already damaged"</li>
              <li>"The one step your evening routine is missing"</li>
              <li>"Why hydration beats anti-ageing in winter"</li>
            </ul>
          </div>
        );
      case 'Ad Angles':
        return (
          <div className="pod-section-content">
            <h4>Ad Angles</h4>
            <ul className="simple-list compact-list">
              <li><strong>Pain-point:</strong> "Your skin barrier is breaking down and you might not even know"</li>
              <li><strong>Desire:</strong> "Wake up to plump, hydrated skin every morning"</li>
              <li><strong>Before/after:</strong> "Week 1 vs Week 4 \u2014 same routine, visible glow"</li>
              <li><strong>Founder story:</strong> "I created this because my own skin was suffering"</li>
              <li><strong>Limited drop:</strong> "Winter bundle. 200 units. Once they sell, they sell."</li>
              <li><strong>Problem/solution:</strong> "Dry skin in winter? Your moisturiser is not enough."</li>
              <li><strong>Luxury/status:</strong> "The routine women with great skin actually follow"</li>
              <li><strong>Price/value:</strong> "$89 for two products that replace your entire shelf"</li>
              <li><strong>Emotional:</strong> "You deserve to feel confident in your skin this winter"</li>
            </ul>
          </div>
        );
      case 'Socials':
        return (
          <div className="pod-section-content">
            <h4>Socials</h4>
            <p><strong>Recommended platforms for this pod:</strong></p>
            <div className="cards-grid" style={{ marginTop: '0.5rem' }}>
              {['Instagram', 'TikTok', 'Pinterest', 'Facebook'].map((platform) => (
                <article key={platform} className="panel detail-card">
                  <h4>{platform}</h4>
                  <p className="subtle">Platform-specific content direction ready</p>
                  <p className="subtle"><strong>Posting permission:</strong> Not connected</p>
                  <p className="subtle"><strong>Ad permission:</strong> Not connected</p>
                  <button className="button button-ghost button-sm">Connect Account</button>
                  <p className="subtle" style={{ fontSize: '0.75rem' }}>Posting and ads: Requires connection and user approval</p>
                </article>
              ))}
            </div>
            <p className="subtle" style={{ marginTop: '0.8rem' }}>Important: Users must connect each platform securely via OAuth. Dovroyn cannot post or run ads until you connect and grant permission. No passwords are stored.</p>
          </div>
        );
      case 'Calendar':
        return (
          <div className="pod-section-content">
            <h4>Content Calendar</h4>
            <p><strong>Tier:</strong> Growth (20 content days/month)</p>
            <p><strong>Target country:</strong> {podData.target_country}</p>
            <p><strong>Calendar length:</strong> Based on paid months</p>
            <p><strong>Calendar status:</strong> Ready to generate</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button className="button button-primary">Generate Calendar</button>
            </div>
            <p className="subtle" style={{ marginTop: '0.5rem' }}>Calendar will be generated from the pod's analysed website/campaign/images, using the accepted/locked-in tone, selected platforms, paid tier, and target country.</p>
            <p className="subtle">Content posting to multiple platforms happens on the same campaign day unless you choose otherwise.</p>
            <p className="subtle">You can preview, edit, approve, or regenerate before anything posts.</p>
          </div>
        );
      case 'Holidays':
        return (
          <div className="pod-section-content">
            <h4>Public Holidays / Seasonal Marketing</h4>
            <p><strong>Target country:</strong> {podData.target_country}</p>
            <p><strong>Upcoming opportunities:</strong></p>
            <ul className="simple-list compact-list">
              <li>Mother's Day (May) \u2014 Gift bundle campaign</li>
              <li>EOFY Sales (June) \u2014 Clearance + new season launch</li>
              <li>Father's Day (September) \u2014 Gift sets for him</li>
              <li>Black Friday (November) \u2014 Biggest sale of the year</li>
              <li>Christmas (December) \u2014 Gift sets and luxury packaging</li>
              <li>New Year (January) \u2014 Fresh start / new routine angle</li>
              <li>Easter (April) \u2014 Seasonal reset campaign</li>
            </ul>
            <p className="subtle">AI will recommend content close to seasonal dates and factor holidays into calendar generation. Real holiday API integration coming soon.</p>
          </div>
        );
      case 'Budget':
        return (
          <div className="pod-section-content">
            <h4>Budget Tracker</h4>
            <div className="cards-grid">
              <article className="panel detail-card">
                <h4>Planned ad budget</h4>
                <p>$2,000/month</p>
              </article>
              <article className="panel detail-card">
                <h4>Ad spend used</h4>
                <p>$847 this month</p>
              </article>
              <article className="panel detail-card">
                <h4>Spend by platform</h4>
                <p>Meta: $520 | Instagram: $327</p>
              </article>
              <article className="panel detail-card">
                <h4>Leads generated</h4>
                <p>142</p>
              </article>
              <article className="panel detail-card">
                <h4>Sales/revenue</h4>
                <p>$4,230</p>
              </article>
              <article className="panel detail-card">
                <h4>Return on ad spend</h4>
                <p>4.99x</p>
              </article>
              <article className="panel detail-card">
                <h4>Cost per lead</h4>
                <p>$5.96</p>
              </article>
              <article className="panel detail-card">
                <h4>Cost per sale</h4>
                <p>$29.79</p>
              </article>
            </div>
            <p className="subtle" style={{ marginTop: '0.5rem' }}>Manual input for MVP. Real ad platform spend syncing coming soon.</p>
          </div>
        );
      case 'Ad Analysis':
        return (
          <div className="pod-section-content">
            <h4>Ad Analysis</h4>
            <p><strong>What is running:</strong> 3 active ad sets across Meta and Instagram</p>
            <p><strong>Best performing:</strong> Hydration reel hook \u2014 4.2% CTR</p>
            <p><strong>Worst performing:</strong> Anti-ageing static \u2014 0.8% CTR</p>
            <p><strong>Best hooks:</strong> "Your evening routine is missing one step", "3 signs your barrier is damaged"</p>
            <p><strong>What to test next:</strong> Founder story video, before/after carousel</p>
            <p><strong>Competitor observation:</strong> Luma Botanics using ingredient transparency with strong results</p>
            <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: 'var(--card)', borderRadius: '12px' }}>
              <p><strong>AI Recommendation:</strong></p>
              <p className="subtle">Shift 40% of budget from static ads to Reels. Test founder story angle with hydration hook.</p>
              <p className="subtle" style={{ fontSize: '0.78rem', fontStyle: 'italic' }}>This change requires your approval before anything is modified.</p>
              <div className="direction-actions">
                <button className="button button-primary button-sm">Approve Change</button>
                <button className="button button-ghost button-sm">Reject</button>
              </div>
            </div>
          </div>
        );
      case 'AI Notes':
        return (
          <div className="pod-section-content">
            <h4>AI Notes / Memory</h4>
            <ul className="simple-list compact-list">
              <li><strong>Decisions made:</strong> Hydration-first messaging chosen over anti-ageing</li>
              <li><strong>Accepted tone:</strong> Expert, reassuring, modern luxury</li>
              <li><strong>Rejected suggestions:</strong> "Playful" tone rejected by user in Week 1</li>
              <li><strong>User preferences:</strong> Prefers carousel over single-image posts</li>
              <li><strong>Past campaign notes:</strong> Quiz landing page converts strongest from social traffic</li>
              <li><strong>Best hooks:</strong> Hydration-focused hooks outperform anti-ageing by 27%</li>
              <li><strong>Brand rules:</strong> Never use the word "cheap" or "basic"</li>
              <li><strong>Things to remember:</strong> Evening skincare content gets best saves and shares</li>
            </ul>
          </div>
        );
      case 'Next Moves':
        return (
          <div className="pod-section-content">
            <h4>Next Marketing Moves</h4>
            <p><strong>Next 3 actions:</strong></p>
            <ul className="simple-list compact-list">
              <li>1. Launch hydration-focused ad set to warm traffic</li>
              <li>2. Publish founder story reel with product stack CTA</li>
              <li>3. Send winter prep email sequence (3 emails over 5 days)</li>
            </ul>
            <p><strong>What needs writing:</strong> Email sequence copy, reel script</p>
            <p><strong>What needs posting:</strong> Monday authority reel, Wednesday carousel</p>
            <p><strong>What needs designing:</strong> Bundle product shot, carousel frames</p>
            <p><strong>What needs testing:</strong> Hydration hook vs barrier repair hook in ads</p>
            <p><strong>What needs approval:</strong> Budget reallocation from static to Reels</p>
            <p><strong>What is blocking progress:</strong> Bundle product photography not yet received</p>
          </div>
        );
      default:
        return <div className="pod-section-content"><p>Select a tab to view pod section.</p></div>;
    }
  };

  return (
    <>
      <div className="pod-tabs">
        {POD_TABS.map((tab) => (
          <button
            key={tab}
            className={`pod-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <section className="panel">
        {renderTabContent()}
      </section>
    </>
  );
}

/* ─── MAIN APP ─── */
function App() {
  const [session, setSession] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!supabaseConfigured) {
      setBootstrapping(false);
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session ?? null);
        setBootstrapping(false);
      }
    });

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      isMounted = false;
      authSub.unsubscribe();
    };
  }, []);

  // Load subscription status
  useEffect(() => {
    if (!supabaseConfigured || !session?.user?.id) return;
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setSubscription(data || { tier: 'free', status: 'inactive', max_pods: 0, monthly_content_days: 0 });
      });
  }, [session?.user?.id]);

  if (bootstrapping) {
    return (
      <div className="center-screen" aria-busy="true">
        <span role="status" aria-live="polite">
          Loading {APP_NAME}...
        </span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<LandingPage session={session} />} />
        <Route path="/login" element={<AuthPage session={session} defaultMode="login" />} />
        <Route path="/signup" element={<AuthPage session={session} defaultMode="signup" />} />
        <Route path="/auth" element={<AuthPage session={session} defaultMode="login" />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/waitlist" element={<Navigate to="/signup" replace />} />
        <Route path="/demo-pod" element={<DemoPodPage />} />

        <Route element={<ProtectedRoute session={session} />}>
          <Route
            element={(
              <AppLayout
                user={session?.user}
                subscription={subscription}
                onSignOut={async () => {
                  if (!supabaseConfigured) return;
                  await supabase.auth.signOut();
                }}
              />
            )}
          >
            <Route path="/dashboard" element={<PodsPage session={session} subscription={subscription} />} />
            <Route path="/pods" element={<PodsPage session={session} subscription={subscription} />} />
            <Route path="/pods/new" element={<NewPodPage session={session} subscription={subscription} />} />
            <Route path="/pods/:podId/*" element={<PodWorkspace session={session} subscription={subscription} />} />
            <Route path="/account" element={<AccountPage session={session} subscription={subscription} />} />
            <Route path="/settings" element={<SettingsPage user={session?.user} subscription={subscription} />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={session ? '/dashboard' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ session }) {
  const location = useLocation();
  if (!supabaseConfigured) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function Wordmark() {
  return <BrandLogo />;
}

/* ─── SOCIAL PROOF DATA ─── */
const TESTIMONIALS = [
  {
    quote: "I went from 'what do I post?' to having a full month of content in 20 minutes. The pod actually understood my brand.",
    name: "Sarah K.",
    role: "Founder, Aurora Skincare",
    metric: "3.2x engagement",
  },
  {
    quote: "We used to plan campaigns in spreadsheets. Now one pod holds the strategy, calendar, and ad angles — and it actually remembers what worked.",
    name: "Marcus T.",
    role: "CMO, Summit Trail Co",
    metric: "12 pods active",
  },
  {
    quote: "The direction-lock feature changed everything. Once the strategy is set, every piece of content follows it. No more off-brand posts.",
    name: "Jessica L.",
    role: "Marketing Director, House of MGNM",
    metric: "Zero off-brand posts",
  },
];

const TRUST_BADGES = [
  { label: "AI-Powered Strategy", icon: Brain },
  { label: "30+ Platforms", icon: Globe2 },
  { label: "Direction Lock", icon: Lock },
  { label: "Real-Time Calendar", icon: Calendar },
];

/* ─── LANDING PAGE ─── */
function LandingPage({ session }) {
  const [billing, setBilling] = useState('monthly');

  return (
    <main className="landing-shell">
      <Header />

      {/* Announcement bar */}
      <div className="announcement-bar">
        <span className="announcement-pill">New</span>
        <span>Free plan now available — 1 pod, 4 content days per month. No credit card required.</span>
      </div>

      <section className="hero-block panel hero-block-v2">
        <div className="hero-badge-row">
          <span className="hero-badge"><Sparkles size={14} /> AI Marketing Pods</span>
        </div>
        <div className="hero-content-centered">
          <h1>Your brand deserves a <span className="hero-emphasis">strategy</span>, not a scramble.</h1>
          <p className="hero-gold-line">Drop in your website. Dovroyn builds your campaign direction, content calendar, and next moves — all inside one intelligent pod.</p>
          <p className="lede">Stop staring at blank content calendars. Each pod learns your brand, locks your strategy, and tells you exactly what to post, where, and when.</p>
          <div className="hero-actions">
            <NavLink className="button button-primary button-lg" to={session ? '/pods' : '/signup'}>
              {session ? 'Open My Pods' : 'Start Free — No Card Required'}
            </NavLink>
            <NavLink className="button button-ghost" to="/demo-pod">See Demo Pod</NavLink>
          </div>
          <div className="hero-trust-row">
            <span className="hero-trust-item"><CheckCircle size={14} /> Free plan available</span>
            <span className="hero-trust-item"><CheckCircle size={14} /> Cancel anytime</span>
            <span className="hero-trust-item"><CheckCircle size={14} /> 30+ platforms</span>
          </div>
        </div>
      </section>

      <TesterPodPreview />

      {/* Social Proof Section */}
      <section className="social-proof-section">
        <p className="eyebrow">Trusted by Founders</p>
        <h2 className="section-title">From blank page to full campaign.</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <article key={i} className="panel testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" aria-hidden="true">{t.name.charAt(0)}</div>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <p className="testimonial-role">{t.role}</p>
                </div>
              </div>
              <span className="testimonial-metric">{t.metric}</span>
            </article>
          ))}
        </div>
        <div className="trust-badges-row">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="trust-badge">
                <Icon size={18} strokeWidth={1.75} />
                <span>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <AiPodAssistant />

      <section className="dashboard-preview">
        <p className="eyebrow">Inside Every Pod</p>
        <h2 className="section-title">Every marketing move visible. Every brand organised.</h2>
        <div className="preview-cards-grid">
          {DASHBOARD_PREVIEW_CARDS.map((card) => (
            <article key={card.title} className="panel preview-card">
              <p className="preview-label">{card.title}</p>
              <p className="preview-metric">{card.metric}</p>
              <p className="preview-note">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="multipod-preview">
        <p className="eyebrow">One Workspace, Many Pods</p>
        <h2 className="section-title">Your marketing world, organised into AI pods.</h2>
        <p className="lede multipod-lede">Create one pod for every brand, launch, website, offer, or campaign. Dovroyn keeps the strategy, content ideas, platforms, ads, and next moves in one place.</p>
        <div className="multipod-dashboard-frame" aria-label="Dovroyn pod ecosystem dashboard preview">
          <div className="multipod-dashboard-topbar">
            <div>
              <span className="multipod-screen-label">Pod Ecosystem</span>
              <strong>Marketing Command Screen</strong>
            </div>
            <div className="multipod-window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="multipod-dashboard-body">
            <aside className="multipod-rail" aria-hidden="true">
              <span />
              <span />
              <span />
            </aside>
            <div className="multipod-grid">
              {MULTI_POD_CARDS.map((pod) => (
                <article key={pod.name} className="multipod-card">
                  <div className="multipod-card-chrome" aria-hidden="true">
                    <span className="multipod-chrome-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="multipod-chrome-url">dovroyn / {pod.slug}</span>
                  </div>
                  <div className="multipod-card-body">
                    <div className="multipod-card-head">
                      <div className="multipod-card-title">
                        <h3 className="multipod-name">{pod.name}</h3>
                        <span className="multipod-pod-type">{pod.type}</span>
                      </div>
                      <span className="multipod-avatar" style={{ background: pod.avatarGradient }} aria-hidden="true">{pod.avatarInitials}</span>
                    </div>
                    <p className="multipod-status">
                      <span className="multipod-status-dot" aria-hidden="true" />
                      {pod.status}
                    </p>
                    <div className="multipod-platforms" aria-label={`${pod.name} connected platforms: ${pod.platforms.map((platform) => platform.name).join(', ')}`}>
                      {pod.platforms.map((platform) => {
                        const PlatformIcon = platform.icon;
                        return (
                          <span key={platform.name} className="multipod-platform-dot" title={platform.name} style={{ color: platform.color }}>
                            <PlatformIcon size={12} strokeWidth={1.9} />
                          </span>
                        );
                      })}
                    </div>
                    <div className="multipod-indicators" aria-label={`${pod.name} content and calendar indicators`}>
                      <span><PenTool size={12} strokeWidth={1.75} />{pod.contentCount}</span>
                      <span><Calendar size={12} strokeWidth={1.75} />{pod.calendarCount}</span>
                    </div>
                  </div>
                </article>
              ))}
              <NavLink className="multipod-card multipod-card-new" to={session ? '/pods/new' : '/signup'}>
                <span className="multipod-card-chrome" aria-hidden="true">
                  <span className="multipod-chrome-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="multipod-chrome-url">dovroyn / new-pod</span>
                </span>
                <span className="multipod-card-body multipod-new-body">
                  <span className="multipod-new-icon" aria-hidden="true"><Plus size={18} strokeWidth={1.75} /></span>
                  <span className="multipod-name">Create New Pod</span>
                  <span className="multipod-stage">Website, offer, app, or campaign</span>
                </span>
              </NavLink>
            </div>
          </div>
          <div className="multipod-dashboard-footer" aria-hidden="true">
            <span>One AI marketing pod per brand, website, app, offer, launch, or campaign.</span>
          </div>
        </div>
      </section>

      <section className="landing-sections">
        {LANDING_SECTIONS.map((section, index) => (
          <article key={section.heading} className="landing-section-item">
            <span className="landing-section-number">{String(index + 1).padStart(2, '0')}</span>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="platforms-section">
        <p className="eyebrow">Platform Planning</p>
        <h2 className="section-title">Plan campaigns for the places your audience already lives.</h2>
        <p className="lede">Dovroyn can analyse and plan for more than 30 social, search, content, messaging, and community platforms. Posting and ads require users to connect their own approved accounts before anything can go live.</p>
        <div className="platforms-legend" aria-hidden="true">
          <span className="platforms-legend-item"><span className="platform-dot" /> Planning-ready</span>
          <span className="platforms-legend-item">Connect your own accounts to go live</span>
        </div>
        <div className="platforms-grid">
          {PLATFORMS.map((platform) => {
            const PlatformIcon = platform.icon;
            return (
              <article key={platform.name} className="platform-tile">
                <span className="platform-icon" aria-hidden="true"><PlatformIcon size={15} /></span>
                <span className="platform-name">{platform.name}</span>
                <span className="platform-focus"><span className="platform-dot" aria-hidden="true" />{platform.focus}</span>
              </article>
            );
          })}
        </div>
        <p className="platforms-note">Platform availability may depend on official account connection, permissions, region, and API access.</p>
      </section>

      <section className="pricing-section">
        <p className="eyebrow">Subscription Pricing</p>
        <h2 className="section-title">Four tiers. Scale when you are ready.</h2>
        <BillingToggle billing={billing} onChange={setBilling} />
        <div className="pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <article key={tier.name} className={`panel pricing-card ${tier.name === 'Free' ? 'pricing-card-free' : ''}`}>
              {tier.name === 'Free' && <span className="pricing-popular-badge">Free Forever</span>}
              <h3 className="pricing-tier-name">{tier.name}</h3>
              {billing === 'monthly' ? (
                <>
                  <p className="pricing-price">{tier.monthly}<span style={{ fontSize: '0.6em', fontWeight: 400 }}>/month</span></p>
                  <p className="pricing-price-yearly">{tier.yearly}/year</p>
                </>
              ) : (
                <>
                  <p className="pricing-price">{tier.yearly}<span style={{ fontSize: '0.6em', fontWeight: 400 }}>/year</span></p>
                  <p className="pricing-price-yearly">{tier.monthly}/month</p>
                </>
              )}
              <p className="pricing-best-for">{tier.bestFor}</p>
              <ul className="pricing-features">
                {tier.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              {tier.stripeKey && STRIPE_PRICING_LINKS[`${tier.stripeKey}_${billing}`] ? (
                <a className="button button-primary" href={STRIPE_PRICING_LINKS[`${tier.stripeKey}_${billing}`]}>Subscribe</a>
              ) : tier.name === 'Free' ? (
                <NavLink className="button button-primary" to="/signup">Start Free</NavLink>
              ) : (
                <NavLink className="button button-primary" to="/signup">Create account</NavLink>
              )}
            </article>
          ))}
        </div>
        <p className="pricing-billing-note">Save 20% with yearly billing.</p>
      </section>

      <Footer variant="full" />
    </main>
  );
}

/* ─── BILLING TOGGLE ─── */
function BillingToggle({ billing, onChange }) {
  return (
    <div className="billing-toggle" role="radiogroup" aria-label="Billing period">
      <button
        type="button"
        role="radio"
        className={`billing-toggle-option${billing === 'monthly' ? ' active' : ''}`}
        aria-checked={billing === 'monthly'}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </button>
      <button
        type="button"
        role="radio"
        className={`billing-toggle-option${billing === 'yearly' ? ' active' : ''}`}
        aria-checked={billing === 'yearly'}
        onClick={() => onChange('yearly')}
      >
        Yearly <span className="billing-toggle-badge">Save 20%</span>
      </button>
    </div>
  );
}

/* ─── DEMO POD PAGE (public) ─── */
function DemoPodPage() {
  return (
    <main className="landing-shell">
      <Header variant="page" showNav />

      <section className="hero-block panel" style={{ padding: '1.5rem' }}>
        <p className="eyebrow">Demo Pod</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Aurora Skincare — AI Marketing Pod</h2>
        <p className="subtle">This demo shows how Dovroyn analyses a website and builds a complete marketing direction inside one pod.</p>
      </section>

      <PodWorkspace demo />

      <Footer />
    </main>
  );
}

/* ─── AUTH PAGE ─── */
function AuthPage({ session, defaultMode = 'login' }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { setMode(defaultMode); }, [defaultMode]);
  useEffect(() => { if (session) navigate('/dashboard', { replace: true }); }, [navigate, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!supabaseConfigured) { setError('Missing Supabase environment variables.'); return; }
    setSubmitting(true); setError(''); setMessage('');
    const action = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { data: { full_name: name.trim() } } });
    const { error: authError } = await action;
    if (authError) { setError(authError.message); }
    else if (mode === 'signup') { setMessage('Check your inbox to confirm your email.'); navigate('/login', { replace: true }); }
    else { navigate('/dashboard', { replace: true }); }
    setSubmitting(false);
  };

  return (
    <main className="auth-shell">
      <div className="auth-card panel">
        <Wordmark />
        <h1 style={{ fontSize: '1.5rem' }}>{mode === 'login' ? 'Welcome back to Dovroyn' : 'Create your first Dovroyn pod'}</h1>
        <p>Secure pod access powered by Supabase authentication.</p>
        {!supabaseConfigured && <div className="alert">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable authentication.</div>}
        <form onSubmit={handleSubmit} className="stack">
          {mode === 'signup' && <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>}
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></label>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="subtle">{message}</p>}
          <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Working...' : (mode === 'login' ? 'Log in' : 'Create account')}</button>
        </form>
        <button className="button button-link" type="button" onClick={() => { setError(''); setMessage(''); const next = mode === 'login' ? 'signup' : 'login'; setMode(next); navigate(`/${next}`); }}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </main>
  );
}

/* ─── APP LAYOUT ─── */
function AppLayout({ user, subscription, onSignOut }) {
  return (
    <div className="app-layout">
      <aside className="sidebar panel">
        <Wordmark />
        <nav>
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-item">{item.label}</NavLink>
          ))}
        </nav>
        {subscription && <p style={{ color: 'var(--gold-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tier: {subscription.tier || 'Free'}</p>}
        <button className="button button-ghost" type="button" onClick={onSignOut}>Sign out</button>
      </aside>
      <section className="content">
        <header className="content-header panel">
          <p className="eyebrow">Dovroyn — Luxury AI Marketing Pods</p>
          <h2>{user?.email}</h2>
        </header>
        <Outlet />
      </section>
    </div>
  );
}

/* ─── DASHBOARD PAGE ─── */
function DashboardPage({ subscription }) {
  return (
    <div className="page-stack">
      <header className="section-header panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h3>Your marketing pods</h3>
          <p className="subtle">Every brand gets its own AI marketing pod.</p>
        </div>
        <NavLink className="button button-primary" to="/pods/new">Create Pod</NavLink>
      </header>

      {subscription && subscription.tier === 'free' && (
        <article className="panel detail-card" style={{ borderColor: 'var(--gold)' }}>
          <h4>Upgrade to start creating pods</h4>
          <p className="subtle">You are on the free tier. Subscribe to a plan to create and manage marketing pods.</p>
          <NavLink className="button button-primary" to="/pricing">View Pricing</NavLink>
        </article>
      )}

      <section className="cards-grid cards-grid-wide">
        {DASHBOARD_PREVIEW_CARDS.map((card) => (
          <article key={card.title} className="panel detail-card">
            <h4>{card.title}</h4>
            <p className="preview-metric">{card.metric}</p>
            <p className="subtle">{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

/* ─── POD DASHBOARD (full 16-tab view for authenticated pods) ─── */
function PodDashboardPage({ session }) {
  const { podId } = useParams();
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured || !podId) { setLoading(false); return; }
    supabase.from('pods').select('*').eq('id', podId).single()
      .then(({ data, error }) => {
        if (data) setPod(data);
        setLoading(false);
      });
  }, [podId]);

  if (loading) return <div className="page-stack"><p className="subtle">Loading pod...</p></div>;

  return (
    <div className="page-stack">
      <header className="section-header panel">
        <div>
          <p className="eyebrow">Pod Dashboard</p>
          <h3>{pod?.pod_name || 'Pod'}</h3>
          <p className="subtle">{pod?.pod_type} pod — {pod?.target_country}</p>
        </div>
        <span className="status-tag">{pod?.status || 'created'}</span>
      </header>

      <PodTabsView pod={pod} />
    </div>
  );
}

/* ─── PRICING PAGE ─── */
function PricingPage() {
  const [billing, setBilling] = useState('monthly');
  return (
    <main className="landing-shell pricing-shell">
      <header className="top-nav">
        <Wordmark />
        <nav className="top-nav-links">
          <NavLink className="nav-link-subtle" to="/">Home</NavLink>
          <NavLink className="nav-link-subtle" to="/login">Login</NavLink>
          <NavLink className="button button-primary button-sm" to="/signup">Create Account</NavLink>
        </nav>
      </header>

      <section className="hero-block panel">
        <p className="eyebrow">Subscription Pricing</p>
        <h1>Select the <span className="hero-emphasis">pod capacity</span> that matches your marketing needs.</h1>
        <p className="lede">Scale from a focused single-brand pod to full multi-brand marketing intelligence. Every tier includes AI analysis, campaign strategy, and content direction.</p>
      </section>

      <div className="pricing-toggle-row">
        <BillingToggle billing={billing} onChange={setBilling} />
      </div>

      <section className="pricing-grid">
        {PRICING_PAGE_TIERS.map((tier) => (
          <article key={tier.name} className={`panel pricing-card ${tier.name === 'Free' ? 'pricing-card-free' : ''}`}>
            {tier.name === 'Free' && <span className="pricing-popular-badge">Free Forever</span>}
            <h3 className="pricing-tier-name">{tier.name}</h3>
            {billing === 'monthly' ? (
              <>
                <p className="pricing-price">{tier.monthly}<span style={{ fontSize: '0.6em', fontWeight: 400 }}>/month</span></p>
                <p className="pricing-price-yearly">{tier.yearly}/year</p>
              </>
            ) : (
              <>
                <p className="pricing-price">{tier.yearly}<span style={{ fontSize: '0.6em', fontWeight: 400 }}>/year</span></p>
                <p className="pricing-price-yearly">{tier.monthly}/month</p>
              </>
            )}
            <p className="pricing-best-for">{tier.bestFor}</p>
            <ul className="pricing-features">
              {tier.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            {tier.stripeKey && STRIPE_PRICING_LINKS[`${tier.stripeKey}_${billing}`] ? (
              <a className="button button-primary" href={STRIPE_PRICING_LINKS[`${tier.stripeKey}_${billing}`]}>Subscribe</a>
            ) : tier.name === 'Free' ? (
              <NavLink className="button button-primary" to="/signup">Start Free</NavLink>
            ) : (
              <NavLink className="button button-primary" to="/signup">Create account</NavLink>
            )}
          </article>
        ))}
      </section>

      <p className="pricing-billing-note" style={{ textAlign: 'center' }}>Save 20% with yearly billing.</p>

      <Footer variant="full" />
    </main>
  );
}

function LegalPageShell({ eyebrow, title, description, children }) {
  return (
    <main className="landing-shell">
      <Header />
      <section className="hero-block panel">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
      </section>
      <section className="waitlist-section panel">
        {children}
      </section>
      <Footer variant="full" />
    </main>
  );
}

function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy"
      title="Privacy policy"
      description="How Dovroyn handles information submitted through the website and product."
    >
      <article className="stack" style={{ gap: '0.9rem' }}>
        <h2 className="waitlist-heading" style={{ marginBottom: '0.4rem' }}>What we collect</h2>
        <p className="subtle">We collect the details you voluntarily provide through account and contact forms, plus essential usage data needed to operate the site.</p>
        <h3>How we use it</h3>
        <p className="subtle">Information is used to provide support, respond to enquiries, improve the product, and share product updates when requested.</p>
        <h3>Contact about privacy</h3>
        <p className="subtle">For privacy enquiries, email <a href="mailto:support@dovroyn.com">support@dovroyn.com</a>.</p>
      </article>
    </LegalPageShell>
  );
}

function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms"
      title="Terms of use"
      description="Website and product access is provided subject to these baseline terms."
    >
      <article className="stack" style={{ gap: '0.9rem' }}>
        <h2 className="waitlist-heading" style={{ marginBottom: '0.4rem' }}>Use of service</h2>
        <p className="subtle">You agree to use Dovroyn lawfully and to provide accurate details when creating an account or submitting forms.</p>
        <h3>Accounts and billing</h3>
        <p className="subtle">Paid plans are processed by Stripe checkout links. Subscription and renewal terms shown at checkout apply.</p>
        <h3>Support</h3>
        <p className="subtle">Questions about these terms can be sent to <a href="mailto:support@dovroyn.com">support@dovroyn.com</a>.</p>
      </article>
    </LegalPageShell>
  );
}

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      if (supabaseConfigured && supabase) {
        const sourceMeta = `contact-page:${name.trim().slice(0, 40) || 'anonymous'}:${message.trim().slice(0, 120)}`;
        const { error } = await supabase.from('waitlist').insert({ email: email.trim(), source: sourceMeta });
        if (error) throw new Error(error.message);
      }
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setErrorMsg(error.message || 'Unable to send your enquiry right now. Please try again.');
    }
  };

  return (
    <LegalPageShell
      eyebrow="Contact"
      title="Talk to the Dovroyn team"
      description="Send your enquiry and we will follow up at your email address."
    >
      {status === 'success' ? (
        <div className="waitlist-confirmation">
          <h2 className="waitlist-heading">Thanks, we received your enquiry.</h2>
          <p className="lede">Our team will respond to <strong>{email || 'your email address'}</strong> as soon as possible.</p>
        </div>
      ) : (
        <>
          <form className="waitlist-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={status === 'loading'}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={status === 'loading'}
            />
            <input
              type="text"
              placeholder="How can we help?"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button className="button button-primary" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
          {status === 'error' && <p className="form-error">{errorMsg}</p>}
        </>
      )}
    </LegalPageShell>
  );
}

/* ─── SETTINGS PAGE ─── */
function SettingsPage({ user, subscription }) {
  const [settings, setSettings] = useState({ workspace_name: 'Dovroyn Pod Command Centre', theme: 'Editorial Ivory and Navy', timezone: 'UTC', email_notifications: true, weekly_digest: true });
  const [status, setStatus] = useState('');

  useEffect(() => {
    let ignore = false;
    if (!supabaseConfigured || !user?.id) return;
    supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data, error }) => {
        if (ignore) return;
        if (data) setSettings({ workspace_name: data.workspace_name || 'Dovroyn Pod Command Centre', theme: data.theme || 'Editorial Ivory and Navy', timezone: data.timezone || 'UTC', email_notifications: Boolean(data.email_notifications), weekly_digest: Boolean(data.weekly_digest) });
      });
    return () => { ignore = true; };
  }, [user?.id]);

  const saveSettings = async (event) => {
    event.preventDefault();
    if (!supabaseConfigured || !user?.id) { setStatus('Configure Supabase to save.'); return; }
    const { error } = await supabase.from('user_settings').upsert({ user_id: user.id, ...settings, updated_at: new Date().toISOString() });
    setStatus(error ? error.message : 'Settings updated.');
  };

  return (
    <form className="card-form panel" onSubmit={saveSettings}>
      <h3>Settings</h3>
      <label>Account<input value={user?.email || 'Not signed in'} readOnly /></label>
      <label>Subscription tier<input value={subscription?.tier || 'Free'} readOnly /></label>
      <label>Workspace name<input value={settings.workspace_name} onChange={(e) => setSettings((p) => ({ ...p, workspace_name: e.target.value }))} /></label>
      <label>Theme
        <select value={settings.theme} onChange={(e) => setSettings((p) => ({ ...p, theme: e.target.value }))}>
          <option value="Editorial Ivory and Navy">Editorial Ivory and Navy</option>
          <option value="Antique Gold Luxe">Antique Gold Luxe</option>
          <option value="Soft Cream Contrast">Soft Cream Contrast</option>
        </select>
      </label>
      <label>Timezone
        <select value={settings.timezone} onChange={(e) => setSettings((p) => ({ ...p, timezone: e.target.value }))}>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
          <option value="Australia/Sydney">Australia/Sydney</option>
        </select>
      </label>
      <label className="checkbox-row"><input type="checkbox" checked={settings.email_notifications} onChange={(e) => setSettings((p) => ({ ...p, email_notifications: e.target.checked }))} />Email notifications</label>
      <label className="checkbox-row"><input type="checkbox" checked={settings.weekly_digest} onChange={(e) => setSettings((p) => ({ ...p, weekly_digest: e.target.checked }))} />Weekly digest</label>
      <button className="button button-primary" type="submit">Save settings</button>
      {status && <p className="subtle">{status}</p>}
    </form>
  );
}

export default App;
