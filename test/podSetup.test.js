import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_BRAND_PHOTOS, validatePodSetup } from '../src/lib/podSetup.js';

test('a URL-based pod needs exactly one primary URL and one logo', () => {
  assert.match(validatePodSetup({ sourceType: 'website', sourceUrl: '', logoCount: 1, photoCount: 0 }), /primary URL/);
  assert.match(validatePodSetup({ sourceType: 'website', sourceUrl: 'https://example.com', logoCount: 0, photoCount: 0 }), /one brand logo/);
  assert.equal(validatePodSetup({ sourceType: 'website', sourceUrl: 'https://example.com', logoCount: 1, photoCount: 0 }), '');
});

test('a photos-only pod requires photos and never accepts more than five', () => {
  assert.match(validatePodSetup({ sourceType: 'photos', sourceUrl: '', logoCount: 1, photoCount: 0 }), /at least one brand photo/);
  assert.equal(validatePodSetup({ sourceType: 'photos', sourceUrl: '', logoCount: 1, photoCount: MAX_BRAND_PHOTOS }), '');
  assert.match(validatePodSetup({ sourceType: 'photos', sourceUrl: '', logoCount: 1, photoCount: MAX_BRAND_PHOTOS + 1 }), /no more than 5/);
});
