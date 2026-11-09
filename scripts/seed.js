#!/usr/bin/env node
/**
 * Seeds a demo account with sample links and click history, so the dashboard
 * and analytics pages have something to show during local testing.
 *
 *   npm run local:seed
 *
 * Demo login (local development only):
 *   email:    demo@tinygate.local
 *   password: DemoPass123
 *
 * Re-running the script resets the demo account's links.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Url = require('../src/models/Url');

const DEMO = { name: 'Demo User', email: 'demo@tinygate.local', password: 'DemoPass123' };
const DAY = 86_400_000;

const LINKS = [
  { shortCode: 'launch',  customAlias: 'launch',  originalUrl: 'https://github.com/AkshatRaj2004', weight: 9, ageDays: 40 },
  { shortCode: 'q4-deck', customAlias: 'q4-deck', originalUrl: 'https://docs.google.com/presentation/d/1x9example/edit', weight: 5, ageDays: 25 },
  { shortCode: 'xk9pq2r', originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections', weight: 3, ageDays: 18 },
  { shortCode: 'mdn-csp', originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP', weight: 2, ageDays: 12 },
  { shortCode: 'hn-post', originalUrl: 'https://news.ycombinator.com/item?id=1', weight: 4, ageDays: 6 },
  { shortCode: 'beta-form', customAlias: 'beta-form', originalUrl: 'https://forms.example.com/beta-signup', weight: 1, ageDays: 3, expiresInDays: 14 },
  { shortCode: 'fresh01', originalUrl: 'https://example.com/just-created', weight: 0, ageDays: 0 },
];

const pick = (pairs) => {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; }
  return pairs[0][0];
};

const fakeClick = (sinceMs) => {
  const device = pick([['desktop', 6], ['mobile', 4], ['tablet', 1]]);
  const os = device === 'desktop'
    ? pick([['Windows', 5], ['Mac OS', 4], ['Linux', 1]])
    : pick([['iOS', 5], ['Android', 5]]);
  const browser = pick([['Chrome', 6], ['Safari', 3], ['Firefox', 1], ['Edge', 1]]);
  const referrer = pick([['direct', 5], ['https://twitter.com/', 2], ['https://www.linkedin.com/', 2], ['https://news.ycombinator.com/', 1], ['https://www.google.com/', 2]]);
  // Bias recent days so the chart trends upward.
  const ago = Math.pow(Math.random(), 1.6) * sinceMs;
  return {
    ip: `192.0.2.${Math.floor(Math.random() * 254) + 1}`,
    browser, os, device, referrer,
    timestamp: new Date(Date.now() - ago),
  };
};

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set. Run `npm run local` once to create .env.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  let user = await User.findOne({ email: DEMO.email });
  if (!user) user = await User.create(DEMO);

  await Url.deleteMany({ $or: [{ user: user._id }, { shortCode: { $in: LINKS.map((l) => l.shortCode) } }] });

  for (const l of LINKS) {
    const ageMs = l.ageDays * DAY;
    const count = l.weight ? Math.round(l.weight * (15 + Math.random() * 25)) : 0;
    const analytics = Array.from({ length: count }, () => fakeClick(Math.max(ageMs, DAY)))
      .sort((a, b) => a.timestamp - b.timestamp);
    const created = new Date(Date.now() - ageMs);
    await Url.create({
      originalUrl: l.originalUrl,
      shortCode: l.shortCode,
      customAlias: l.customAlias,
      user: user._id,
      expiresAt: l.expiresInDays ? new Date(Date.now() + l.expiresInDays * DAY) : null,
      clicks: count,
      analytics,
      createdAt: created,
      updatedAt: created,
    });
  }

  console.log(`✓ Seeded ${LINKS.length} links for ${DEMO.email} (password: ${DEMO.password})`);
  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(`✗ Seed failed: ${err.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
