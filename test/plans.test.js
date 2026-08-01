import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PLAN_ENTITLEMENTS,
  canCreatePod,
  getMonthlyAllowanceWindow,
  hasActivePaidAccess,
} from '../src/lib/plans.js';

test('confirmed plan limits match the subscription contract', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(PLAN_ENTITLEMENTS).slice(1).map(([key, plan]) => [key, [plan.maxPods, plan.monthlyContentDays, plan.weeklyPostingDays]])),
    {
      starter: [1, 10, 2],
      growth: [3, 20, 3],
      pro: [7, 30, 6],
      scale: [12, 30, 7],
    },
  );
});

test('pod limit stops creation at the plan maximum', () => {
  assert.equal(canCreatePod('starter', 0), true);
  assert.equal(canCreatePod('starter', 1), false);
});

test('monthly allowance renews on the subscription anniversary day', () => {
  const beforeRenewal = getMonthlyAllowanceWindow('2026-07-10T00:00:00.000Z', '2026-08-09T23:59:59.000Z');
  assert.equal(beforeRenewal.startsAt.toISOString(), '2026-07-10T00:00:00.000Z');
  assert.equal(beforeRenewal.endsAt.toISOString(), '2026-08-10T00:00:00.000Z');

  const afterRenewal = getMonthlyAllowanceWindow('2026-07-10T00:00:00.000Z', '2026-08-10T00:00:00.000Z');
  assert.equal(afterRenewal.startsAt.toISOString(), '2026-08-10T00:00:00.000Z');
  assert.equal(afterRenewal.endsAt.toISOString(), '2026-09-10T00:00:00.000Z');
});

test('month-end subscription anniversaries clamp safely', () => {
  const window = getMonthlyAllowanceWindow('2026-01-31T00:00:00.000Z', '2026-02-28T12:00:00.000Z');
  assert.equal(window.startsAt.toISOString(), '2026-02-28T00:00:00.000Z');
  assert.equal(window.endsAt.toISOString(), '2026-03-31T00:00:00.000Z');
});

test('paid access needs an active status and a future period end', () => {
  const now = '2026-07-31T00:00:00.000Z';
  assert.equal(hasActivePaidAccess({ status: 'active', current_period_end: '2026-08-10T00:00:00.000Z' }, now), true);
  assert.equal(hasActivePaidAccess({ status: 'past_due', current_period_end: '2026-08-10T00:00:00.000Z' }, now), false);
  assert.equal(hasActivePaidAccess({ status: 'active', current_period_end: '2026-07-10T00:00:00.000Z' }, now), false);
});
