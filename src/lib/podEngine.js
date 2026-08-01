import { getPlatform } from './platforms.js';

const cleanTag = (value) => value.replace(/[^a-z0-9]/gi, '');

export function buildHashtags(keywords, count) {
  const unique = [...new Set((keywords || []).map(cleanTag).filter(Boolean))];
  return unique.slice(0, count).map((tag) => `#${tag}`);
}

export function formatPlatformPost({ platformKey, body, keywords = [], callToAction = '' }) {
  const platform = getPlatform(platformKey);
  if (!platform) throw new Error(`Unknown platform: ${platformKey}`);

  const parts = [String(body || '').trim(), String(callToAction || '').trim()].filter(Boolean);
  if (platform.rules.hashtagStyle === 'recommended' || platform.rules.hashtagStyle === 'limited') {
    const tags = buildHashtags(keywords, platform.rules.recommendedHashtags);
    if (tags.length) parts.push(tags.join(' '));
  }

  let content = parts.join('\n\n');
  if (platform.rules.hashtagStyle === 'avoid') {
    content = content.replace(/(^|\s)#[a-z0-9_]+/gi, '').replace(/[ \t]{2,}/g, ' ').trim();
  }
  if (platform.rules.maxCharacters && content.length > platform.rules.maxCharacters) {
    content = `${content.slice(0, Math.max(0, platform.rules.maxCharacters - 1)).trimEnd()}…`;
  }

  return {
    platformKey,
    platformName: platform.name,
    content,
    characterCount: content.length,
    contentStyle: platform.rules.contentStyle,
  };
}

export function applyPodPreference(analysis, preference) {
  const trimmed = String(preference || '').trim();
  if (!trimmed) return analysis;
  return {
    ...analysis,
    approved: false,
    directionStatus: 'overridden',
    userDirection: trimmed,
    tone: trimmed,
  };
}

export function selectCalendarMoments({ publicHolidays = [], religiousObservances = [], includeReligious = false }) {
  const holidays = publicHolidays.map((item) => ({ ...item, source: 'public-holiday' }));
  if (!includeReligious) return holidays;
  return [...holidays, ...religiousObservances.map((item) => ({ ...item, source: 'selected-observance' }))];
}
