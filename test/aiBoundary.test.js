import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPublicAssistantInstructions } from '../api/ai/chat.js';
import { createSafetyIdentifier } from '../api/_lib/openai.js';
import { buildPodAiContext } from '../api/_lib/podContext.js';
import { extractReadableText, validatePublicWebsiteUrl } from '../api/_lib/webSource.js';

test('OpenAI safety identifiers are stable without exposing the Supabase user id', () => {
  const userId = '6ad64dc2-79a7-4ed0-8e28-980ca5da29a0';
  const first = createSafetyIdentifier(userId);
  const second = createSafetyIdentifier(userId);

  assert.equal(first, second);
  assert.match(first, /^dovroyn_[a-f0-9]{48}$/);
  assert.ok(first.length <= 64);
  assert.doesNotMatch(first, new RegExp(userId));
  assert.notEqual(first, createSafetyIdentifier('another-user'));
});

test('demo pod AI is instructed to answer directly with specific advertising platforms', () => {
  const instructions = buildPublicAssistantInstructions({ demoPod: true });

  assert.match(instructions, /Aurora Skincare demo pod/);
  assert.match(instructions, /Answer the user's exact question immediately/);
  assert.match(instructions, /name specific websites or platforms/);
  assert.match(instructions, /Australian skincare brand/);
});

test('pod AI context is stateless and isolated between pods', () => {
  const first = buildPodAiContext({
    pod: { id: 'pod-a', pod_name: 'Aurora', brand_name: 'Aurora Skin', target_country: 'Australia' },
    analysis: { brand_summary: 'Calm skincare', tone: 'Reassuring' },
    sources: [{ source_type: 'website', source_url: 'https://aurora.example', notes: 'Winter launch' }],
    preferences: [{ preference_type: 'tone', preference_value: { value: 'Plain language' } }],
  });
  const second = buildPodAiContext({
    pod: { id: 'pod-b', pod_name: 'Gidgee', brand_name: 'Gidgee & Co', target_country: 'Australia' },
    analysis: { brand_summary: 'Outdoor hats', tone: 'Warm Australian' },
    sources: [],
    preferences: [],
  });

  assert.match(first, /Aurora Skin/);
  assert.match(first, /Winter launch/);
  assert.match(second, /Gidgee & Co/);
  assert.doesNotMatch(second, /Aurora|Winter launch/);
});

test('website analysis blocks local and private network targets', async () => {
  await assert.rejects(() => validatePublicWebsiteUrl('http://localhost:3000'), /public website/i);
  await assert.rejects(() => validatePublicWebsiteUrl('http://127.0.0.1/admin'), /public website/i);
  await assert.rejects(() => validatePublicWebsiteUrl('http://169.254.169.254/latest/meta-data'), /public website/i);
  await assert.rejects(() => validatePublicWebsiteUrl('https://10.0.0.8'), /public website/i);
});

test('website analysis extracts readable text and removes executable page content', () => {
  const html = `
    <html><head><style>.hidden { display:none }</style><script>stealSecrets()</script></head>
    <body><h1>Aurora &amp; Co</h1><p>Calm skin&nbsp;care.</p><nav>Shop Home</nav></body></html>
  `;
  const text = extractReadableText(html);

  assert.match(text, /Aurora & Co/);
  assert.match(text, /Calm skin care/);
  assert.doesNotMatch(text, /stealSecrets|display:none|<h1>/);
});
