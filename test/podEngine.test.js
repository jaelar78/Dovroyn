import test from 'node:test';
import assert from 'node:assert/strict';
import { PLATFORM_CATALOG } from '../src/lib/platforms.js';
import { applyPodPreference, formatPlatformPost, selectCalendarMoments } from '../src/lib/podEngine.js';

test('catalog includes more than 30 honestly-labelled planning platforms', () => {
  assert.ok(PLATFORM_CATALOG.length > 30);
  assert.ok(PLATFORM_CATALOG.every((platform) => platform.connectionStatus === 'provider-setup-required'));
});

test('Instagram includes relevant hashtags while Facebook removes them', () => {
  const instagram = formatPlatformPost({ platformKey: 'instagram', body: 'Meet the new winter range.', keywords: ['Winter Skin', 'Australian Beauty'] });
  const facebook = formatPlatformPost({ platformKey: 'facebook', body: 'Meet #WinterSkin today (#AustralianBeauty).', keywords: ['Australian Beauty'] });

  assert.match(instagram.content, /#WinterSkin/);
  assert.doesNotMatch(facebook.content, /#/);
});

test('pod overrides update future direction without auto-approving it', () => {
  const result = applyPodPreference({ tone: 'Playful', approved: true }, 'Precise and reassuring');
  assert.equal(result.tone, 'Precise and reassuring');
  assert.equal(result.directionStatus, 'overridden');
  assert.equal(result.approved, false);
});

test('religious observances are opt-in', () => {
  const input = {
    publicHolidays: [{ name: 'Australia Day' }],
    religiousObservances: [{ name: 'Selected observance' }],
  };
  assert.equal(selectCalendarMoments(input).length, 1);
  assert.equal(selectCalendarMoments({ ...input, includeReligious: true }).length, 2);
});
