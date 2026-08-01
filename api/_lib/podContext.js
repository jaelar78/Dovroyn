function cleanText(value, maxLength = 3000) {
  if (value == null) return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function buildPodAiContext({ pod, analysis, sources = [], preferences = [] }) {
  const canonicalSources = sources.filter((source) => {
    if (!source.source_url) return true;
    if (!pod?.source_url) return true;
    return source.source_url === pod?.source_url;
  });
  const sourceLines = canonicalSources.slice(0, 12).map((source, index) => [
    `Source ${index + 1}`,
    cleanText(source.source_type || 'source', 100),
    cleanText(source.source_url, 1000),
    cleanText(source.notes, 2500),
  ].filter(Boolean).join(' | '));
  const preferenceLines = preferences.slice(0, 20).map((preference, index) => [
    `Preference ${index + 1}`,
    cleanText(preference.preference_type, 100),
    cleanText(preference.preference_value, 1200),
  ].filter(Boolean).join(' | '));

  return [
    `Pod ID: ${cleanText(pod?.id, 100)}`,
    `Pod name: ${cleanText(pod?.pod_name, 300) || 'Not supplied'}`,
    `Brand: ${cleanText(pod?.brand_name, 300) || 'Not supplied'}`,
    `Pod type: ${cleanText(pod?.pod_type, 100) || 'Not supplied'}`,
    `Target region: ${cleanText(pod?.target_country, 200) || 'Not supplied'}`,
    `Primary website: ${cleanText(pod?.source_url, 1000) || 'Not supplied'}`,
    `Approved tone: ${cleanText(pod?.accepted_tone || analysis?.tone, 1000) || 'Not approved yet'}`,
    `Approved strategy: ${cleanText(pod?.accepted_strategy, 1500) || 'Not approved yet'}`,
    `Brand summary: ${cleanText(analysis?.brand_summary, 2500) || 'No saved analysis'}`,
    `Audience: ${cleanText(analysis?.audience, 1500) || 'Not supplied'}`,
    `Offer: ${cleanText(analysis?.offer_direction, 1500) || 'Not supplied'}`,
    `Campaign angles: ${cleanText(analysis?.campaign_angles, 2000) || 'Not supplied'}`,
    sourceLines.length ? `Pod sources:\n${sourceLines.join('\n')}` : 'Pod sources: none saved',
    preferenceLines.length ? `User corrections and preferences:\n${preferenceLines.join('\n')}` : 'User corrections and preferences: none saved',
  ].join('\n').slice(0, 24000);
}
