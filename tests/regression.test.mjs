import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const scripts = html => [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

for (const page of ['index.html', 'admin.html']) {
  test(page + ' is complete and JavaScript parses', () => {
    const html = read(page);
    assert.match(html.trimStart(), /^<!DOCTYPE html>/i);
    assert.doesNotMatch(html, /tokens truncated|Warning: truncated output/);
    for (const code of scripts(html)) new Script(code);
  });
}

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
  assert.match(html, /id="orderModal"\s+hidden/);
  assert.match(html, /class="logo-mark" aria-hidden="true">A<\/span>/);
  assert.match(html, /--adler-accent: #e7b64a/);
  assert.doesNotMatch(html, /images\.unsplash\.com/);
  assert.doesNotMatch(html, /Parkstraße 15|48143 Münster|0251 123456/);
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

const edgeCode = stripTypeScriptTypes(read('supabase/functions/submit-order/index.ts'));
function edge(reserveAllowed = true) {
  let handler;
  const requests = [];
  const context = createContext({ Request, Response, TextEncoder, crypto, console,
    Deno: { serve(fn) { handler = fn; }, env: { get(name) { return ({
      SUPABASE_PUBLISHABLE_KEYS: '{"default":"test-public"}',
      SUPABASE_SECRET_KEYS: '{"order_submitter":"test-secret"}', ORDER_RATE_LIMIT_SALT: 'test-salt',
    })[name]; } } },
    fetch: async (url, init) => { requests.push({url, init}); return url.includes('/rpc/')
      ? Response.json(reserveAllowed) : new Response(null, {status:201}); },
  });
  new Script(edgeCode).runInContext(context);
  return { requests, handler, submit: payload => handler(new Request('https://example.invalid', {
    method:'POST', headers:{ origin:'http://localhost:8080', apikey:'test-public', 'cf-connecting-ip':'192.0.2.1' },
    body:JSON.stringify(payload),
  })) };
}
const order = {first_name:'Test', last_name:'Test', phone:'0251 123456', medicine:'TEST', callback:false};
test('CORS permits all headers from both current and previously published forms', async () => {
  const {handler} = edge();
  const response = await handler(new Request('https://example.invalid', {method:'OPTIONS',headers:{origin:'http://localhost:8080'}}));
  assert.equal(response.status,204);
  for (const header of ['content-type','apikey','prefer']) assert.ok(response.headers.get('access-control-allow-headers').includes(header));
});
test('Optional message accepts missing, null, empty and whitespace values', async () => {
  for (const message of [undefined, null, '', '   ', 'Info']) {
    const {submit,requests} = edge();
    assert.equal((await submit({...order,message})).status,201);
    assert.equal(JSON.parse(requests[1].init.body).message, message?.trim() || null);
  }
});
test('Malformed data is rejected before database access', async () => {
  for (const payload of [null, [], {...order,phone:'123'}, {...order,message:123}, {...order,message:'x'.repeat(2001)}]) {
    const {submit,requests} = edge();
    assert.equal((await submit(payload)).status,400);
    assert.equal(requests.length,0);
  }
});
test('Rate limit prevents insertion', async () => {
  const {submit,requests} = edge(false);
  assert.equal((await submit(order)).status,429);
  assert.equal(requests.length,1);
});

