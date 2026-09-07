import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const scripts = html => [...html.matchAll(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

for (const page of ['index.html', 'admin.html', 'impressum.html', 'datenschutz.html']) {
  test(page + ' is complete and JavaScript parses', () => {
    const html = read(page);
    assert.match(html.trimStart(), /^<!DOCTYPE html>/i);
    assert.doesNotMatch(html, /tokens truncated|Warning: truncated output/);
    for (const code of scripts(html)) new Script(code);
  });
}

test('Static pages declare a restrictive content security policy', () => {
  const publicPage = read('index.html');
  const adminPage = read('admin.html');
  assert.match(publicPage, /http-equiv="Content-Security-Policy"/);
  assert.match(publicPage, /object-src 'none'/);
  assert.match(adminPage, /http-equiv="Content-Security-Policy"/);
  assert.match(adminPage, /https:\/\/cdn\.jsdelivr\.net/);
  assert.match(adminPage, /wss:\/\/iezjojbuyzugfguhizyw\.supabase\.co/);
});

test('Public website uses Adler data and directs sensitive digital services externally', () => {
  const html = read('index.html');
  assert.match(html, /Adler Apotheke Krefeld/);
  assert.match(html, /Hochstraße 58/);
  assert.match(html, /02151 24414/);
  assert.match(html, /ihreapotheken\.de\/apotheke\/adler-apotheke-krefeld-47798-120048/);
  assert.match(html, /aponet\.de\/apotheke\/notdienstsuche\/47800/);
  assert.match(html, /Inhaberin Gaby Claßen/);
  assert.match(html, /Montag bis Freitag liefern wir in Krefeld/);
  assert.match(html, /href="#lieferdienst"/);
  assert.match(html, /Route planen/);
  assert.match(html, /id="angebote"/);
  assert.match(html, /Monatsangebote für die kalte Jahreszeit/);
  assert.doesNotMatch(html, /id="orderModal"|id="orderForm"|submit-order|Medikament vorbestellen/);
  assert.match(html, /class="logo-mark" aria-hidden="true">A<\/span>/);
  assert.match(html, /--adler-accent: #e7b64a/);
  assert.match(html, /"@type": "Pharmacy"/);
  assert.match(html, /href="datenschutz\.html"/);
  assert.match(html, /öffnet " \+ nextOpening/);
  assert.match(html, /const href = this\.getAttribute\("href"\)/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.reveal[\s\S]*?opacity: 1/);
  assert.doesNotMatch(html, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\*\s*\{/);
  assert.doesNotMatch(html, /images\.unsplash\.com/);
  assert.doesNotMatch(html, /adler-cookie-notice-acknowledged|localStorage/);
  assert.doesNotMatch(html, /Parkstraße 15|48143 Münster|0251 123456/);
});

test('Legal pages contain the verified operator details and disclose this deployment', () => {
  const imprint = read('impressum.html');
  const privacy = read('datenschutz.html');
  assert.match(imprint, /Gaby Claßen/);
  assert.match(imprint, /DE215618991/);
  assert.match(imprint, /Apothekerkammer Nordrhein/);
  assert.match(privacy, /GitHub Pages/);
  assert.match(privacy, /Supabase/);
  assert.match(privacy, /höchstens 90 Tage/);
  assert.match(privacy, /keine Analyse- oder Marketing-Cookies/);
});

function dom() {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, {
      value: '', checked: false, disabled: false, textContent: '', style: {},
      classList: { add() {}, remove() {}, contains() { return false; } },
      handlers: {}, addEventListener(event, fn) { this.handlers[event] = fn; },
      querySelector(sel) { return get(sel); }, querySelectorAll() { return []; },
      setAttribute() {},
    });
    return elements.get(id);
  };
  return { get, document: { getElementById: get, documentElement: get('html'),
    body: get('body'), querySelectorAll: () => [], addEventListener() {}, title: '' } };
}

test('Admin initialization registers a working password login handler', async () => {
  const { get, document } = dom();
  let calls = 0;
  const context = createContext({ document, console,
    window: { supabase: { createClient: () => ({ auth: {
      onAuthStateChange() {}, getUser: async () => ({data: {}, error: true}),
      signInWithPassword: async data => { calls++; assert.equal(data.email, 'test@example.invalid'); return { error: {code:'invalid_credentials'} }; },
    } }) } }, localStorage: { getItem: () => null }, setTimeout, clearTimeout, setInterval: () => 0,
  });
  for (const code of scripts(read('admin.html'))) new Script(code).runInContext(context);
  get('email').value = ' test@example.invalid ';
  get('password').value = 'test';
  assert.equal(typeof get('loginForm').handlers.submit, 'function');
  await get('loginForm').handlers.submit({ preventDefault() {} });
  assert.equal(calls, 1);
  assert.match(get('loginError').textContent, /Passwort ist falsch/);
  assert.equal(get('loginButton').disabled, false);
});

test('Admin manages neutral enquiries with categories and the Phase-6 status flow', () => {
  const html = read('admin.html');
  assert.match(html, /id="categoryFilter"/);
  assert.match(html, /Rückrufanfrage/);
  assert.match(html, /Technische Anfrage/);
  assert.match(html, /Rückmeldung erforderlich/);
  assert.match(html, /Archiviert/);
  assert.match(html, /request_category/);
  assert.match(html, /id="loginError"[\s\S]*?role="alert"[\s\S]*?aria-live="assertive"/);
  assert.match(html, /:focus-visible/);
  assert.doesNotMatch(html, /Abholbereit/);
});

const edgeCode = stripTypeScriptTypes(read('supabase/functions/submit-order/index.ts'));
function edge() {
  let handler;
  const context = createContext({ Response, JSON, Deno: { serve(fn) { handler = fn; } } });
  new Script(edgeCode).runInContext(context);
  return handler;
}
test('Retired public order endpoint cannot accept health-related enquiry data', async () => {
  const handler = edge();
  const response = await handler(new Request('https://example.invalid', {
    method: 'POST',
    headers: { origin: 'https://jstenkamp007.github.io', apikey: 'public-key' },
    body: JSON.stringify({ first_name: 'Test', medicine: 'Sensitive data' }),
  }));
  assert.equal(response.status, 410);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.doesNotMatch(await response.text(), /Sensitive data/);
});

