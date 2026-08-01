import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const MAX_PAGE_BYTES = 1_000_000;
const MAX_READABLE_CHARS = 14_000;

function unsafeIpv4(address) {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && (b === 0 || b === 168))
    || (a === 198 && (b === 18 || b === 19 || b === 51))
    || (a === 203 && b === 0)
    || a >= 224;
}

function unsafeIpv6(address) {
  const value = address.toLowerCase().split('%')[0];
  if (value === '::' || value === '::1' || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe8') || value.startsWith('fe9') || value.startsWith('fea') || value.startsWith('feb') || value.startsWith('2001:db8:')) return true;
  const mapped = value.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? unsafeIpv4(mapped[1]) : false;
}

function isUnsafeAddress(address) {
  const version = isIP(address);
  return version === 4 ? unsafeIpv4(address) : version === 6 ? unsafeIpv6(address) : true;
}

function publicWebsiteError() {
  const error = new Error('Use a public website URL that Dovroyn can safely analyse.');
  error.status = 400;
  return error;
}

export async function validatePublicWebsiteUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || '').trim());
  } catch {
    throw publicWebsiteError();
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw publicWebsiteError();
  if (url.port && !['80', '443'].includes(url.port)) throw publicWebsiteError();

  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) throw publicWebsiteError();

  if (isIP(hostname)) {
    if (isUnsafeAddress(hostname)) throw publicWebsiteError();
  } else {
    let addresses;
    try {
      addresses = await lookup(hostname, { all: true, verbatim: true });
    } catch {
      const error = new Error('Dovroyn could not find that website.');
      error.status = 422;
      throw error;
    }
    if (!addresses.length || addresses.some(({ address }) => isUnsafeAddress(address))) throw publicWebsiteError();
  }
  return url;
}

function decodeHtmlEntities(value) {
  const named = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…',
  };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isInteger(codePoint) && codePoint <= 0x10FFFF ? String.fromCodePoint(codePoint) : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}

export function extractReadableText(html) {
  return decodeHtmlEntities(String(html || ''))
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(p|div|section|article|main|header|footer|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\t\f\v ]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_READABLE_CHARS);
}

export async function fetchWebsiteText(rawUrl) {
  let currentUrl = await validatePublicWebsiteUrl(rawUrl);
  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response;
    try {
      response = await fetch(currentUrl, {
        redirect: 'manual',
        signal: controller.signal,
        headers: { 'User-Agent': 'DovroynWebsiteAnalyzer/1.0' },
      });
    } catch {
      throw Object.assign(new Error('Dovroyn could not read that website.'), { status: 422 });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirectCount === 3) throw Object.assign(new Error('The website redirected too many times.'), { status: 422 });
      currentUrl = await validatePublicWebsiteUrl(new URL(location, currentUrl).toString());
      continue;
    }
    if (!response.ok) throw Object.assign(new Error('Dovroyn could not read that website.'), { status: 422 });

    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml') && !contentType.includes('text/plain')) {
      throw Object.assign(new Error('That URL is not a readable website page.'), { status: 422 });
    }
    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength > MAX_PAGE_BYTES) throw Object.assign(new Error('That website page is too large to analyse safely.'), { status: 422 });

    const body = (await response.text()).slice(0, MAX_PAGE_BYTES);
    const text = contentType.includes('text/plain') ? body.trim().slice(0, MAX_READABLE_CHARS) : extractReadableText(body);
    if (!text) throw Object.assign(new Error('Dovroyn could not find readable text on that page.'), { status: 422 });
    return { url: currentUrl.toString(), text };
  }
  throw Object.assign(new Error('Dovroyn could not read that website.'), { status: 422 });
}
