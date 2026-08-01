const DEFAULT_RULES = Object.freeze({
  maxCharacters: null,
  hashtagStyle: 'optional',
  recommendedHashtags: 0,
  contentStyle: 'clear, useful, and native to the platform',
});

function platform(key, name, category, focus, rules = {}) {
  return Object.freeze({
    key,
    name,
    category,
    focus,
    planningReady: true,
    connectionStatus: 'provider-setup-required',
    publishingStatus: 'provider-setup-required',
    rules: Object.freeze({ ...DEFAULT_RULES, ...rules }),
  });
}

export const PLATFORM_CATALOG = Object.freeze([
  platform('instagram', 'Instagram', 'social', 'Visual storytelling and discovery', { maxCharacters: 2200, hashtagStyle: 'recommended', recommendedHashtags: 6, contentStyle: 'visual, concise, and save-worthy' }),
  platform('facebook', 'Facebook', 'social', 'Community and broad audience reach', { maxCharacters: 63206, hashtagStyle: 'avoid', contentStyle: 'conversational with a clear link or action' }),
  platform('tiktok', 'TikTok', 'video', 'Short-form discovery', { maxCharacters: 2200, hashtagStyle: 'recommended', recommendedHashtags: 4, contentStyle: 'hook-first short-form video copy' }),
  platform('youtube', 'YouTube', 'video', 'Long and short video search', { maxCharacters: 5000, hashtagStyle: 'limited', recommendedHashtags: 3, contentStyle: 'searchable title and value-led description' }),
  platform('youtube_shorts', 'YouTube Shorts', 'video', 'Vertical video discovery', { maxCharacters: 100, hashtagStyle: 'limited', recommendedHashtags: 2, contentStyle: 'fast hook and one clear payoff' }),
  platform('linkedin', 'LinkedIn', 'social', 'B2B authority and professional reach', { maxCharacters: 3000, hashtagStyle: 'limited', recommendedHashtags: 2, contentStyle: 'specific professional insight with a human point of view' }),
  platform('x', 'X', 'social', 'Real-time conversation', { maxCharacters: 280, hashtagStyle: 'limited', recommendedHashtags: 1, contentStyle: 'tight, timely, and conversational' }),
  platform('threads', 'Threads', 'social', 'Conversational brand voice', { maxCharacters: 500, hashtagStyle: 'avoid', contentStyle: 'casual conversation or sharp observation' }),
  platform('pinterest', 'Pinterest', 'discovery', 'Evergreen visual search', { maxCharacters: 500, hashtagStyle: 'avoid', contentStyle: 'keyword-rich and benefit-led' }),
  platform('snapchat', 'Snapchat', 'social', 'Vertical youth-focused storytelling', { hashtagStyle: 'avoid', contentStyle: 'immediate, playful, and visual' }),
  platform('reddit', 'Reddit', 'community', 'Niche community participation', { hashtagStyle: 'avoid', contentStyle: 'transparent, useful, and community-first' }),
  platform('whatsapp', 'WhatsApp', 'messaging', 'Direct customer messaging', { hashtagStyle: 'avoid', contentStyle: 'personal, brief, and permission-based' }),
  platform('telegram', 'Telegram', 'messaging', 'Broadcast channels and communities', { hashtagStyle: 'optional', recommendedHashtags: 1, contentStyle: 'direct update with useful context' }),
  platform('discord', 'Discord', 'community', 'Owned community engagement', { hashtagStyle: 'avoid', contentStyle: 'community-native announcement or discussion prompt' }),
  platform('wechat', 'WeChat', 'messaging', 'Regional messaging and content', { hashtagStyle: 'avoid', contentStyle: 'localised, informative, and service-led' }),
  platform('line', 'LINE', 'messaging', 'Regional direct messaging', { hashtagStyle: 'avoid', contentStyle: 'compact, localised customer update' }),
  platform('tumblr', 'Tumblr', 'social', 'Fandom and visual storytelling', { hashtagStyle: 'recommended', recommendedHashtags: 5, contentStyle: 'expressive, visual, and community-aware' }),
  platform('mastodon', 'Mastodon', 'social', 'Federated community conversation', { maxCharacters: 500, hashtagStyle: 'limited', recommendedHashtags: 2, contentStyle: 'conversational and non-promotional' }),
  platform('bluesky', 'Bluesky', 'social', 'Open social conversation', { maxCharacters: 300, hashtagStyle: 'limited', recommendedHashtags: 1, contentStyle: 'brief, direct, and conversational' }),
  platform('twitch', 'Twitch', 'video', 'Live-stream communities', { hashtagStyle: 'avoid', contentStyle: 'live-event hook and community callout' }),
  platform('spotify', 'Spotify', 'audio', 'Audio and podcast reach', { hashtagStyle: 'avoid', contentStyle: 'audio-first title and listener benefit' }),
  platform('apple_podcasts', 'Apple Podcasts', 'audio', 'Podcast discovery', { hashtagStyle: 'avoid', contentStyle: 'searchable episode summary and guest value' }),
  platform('substack', 'Substack', 'publishing', 'Newsletter publishing', { hashtagStyle: 'avoid', contentStyle: 'strong subject, useful premise, and reader promise' }),
  platform('medium', 'Medium', 'publishing', 'Long-form thought leadership', { hashtagStyle: 'avoid', contentStyle: 'searchable long-form story with a clear thesis' }),
  platform('google_business', 'Google Business Profile', 'local', 'Local discovery and updates', { maxCharacters: 1500, hashtagStyle: 'avoid', contentStyle: 'local, factual, and action-led' }),
  platform('nextdoor', 'Nextdoor', 'local', 'Neighbourhood reach', { hashtagStyle: 'avoid', contentStyle: 'local, helpful, and neighbourly' }),
  platform('google_ads', 'Google Ads', 'ads', 'Intent-based search advertising', { hashtagStyle: 'avoid', contentStyle: 'keyword-aligned benefit and direct action' }),
  platform('meta_ads', 'Meta Ads', 'ads', 'Facebook and Instagram advertising', { hashtagStyle: 'avoid', contentStyle: 'audience-specific benefit, proof, and action' }),
  platform('linkedin_ads', 'LinkedIn Ads', 'ads', 'B2B paid acquisition', { hashtagStyle: 'avoid', contentStyle: 'role-specific business outcome and proof' }),
  platform('tiktok_ads', 'TikTok Ads', 'ads', 'Native short-form paid reach', { hashtagStyle: 'limited', recommendedHashtags: 2, contentStyle: 'creator-native hook, proof, and action' }),
  platform('pinterest_ads', 'Pinterest Ads', 'ads', 'Paid visual discovery', { hashtagStyle: 'avoid', contentStyle: 'aspirational keyword-led benefit' }),
  platform('amazon_ads', 'Amazon Ads', 'ads', 'Retail product discovery', { hashtagStyle: 'avoid', contentStyle: 'product benefit, differentiator, and retail intent' }),
  platform('microsoft_ads', 'Microsoft Ads', 'ads', 'Search advertising', { hashtagStyle: 'avoid', contentStyle: 'search-intent benefit and direct action' }),
  platform('email', 'Email', 'owned', 'Retention and conversion', { hashtagStyle: 'avoid', contentStyle: 'clear subject, personal value, and one primary action' }),
  platform('sms', 'SMS', 'owned', 'Permission-based direct response', { maxCharacters: 160, hashtagStyle: 'avoid', contentStyle: 'concise, timely, and consent-based' }),
  platform('blog', 'Website Blog', 'owned', 'Search and owned content', { hashtagStyle: 'avoid', contentStyle: 'searchable, structured, and genuinely useful' }),
]);

export function getPlatform(key) {
  return PLATFORM_CATALOG.find((item) => item.key === key) || null;
}

export function getPlanningPlatforms() {
  return PLATFORM_CATALOG.filter((item) => item.planningReady);
}
