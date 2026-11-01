import test from 'node:test';
import assert from 'node:assert/strict';
import { extractGeminiStatus, requestWithGeminiRetry } from './gemini.js';

test('extracts statuses from SDK retryable HTTP messages', () => {
  assert.equal(extractGeminiStatus(new Error('Retryable HTTP Error: Service Unavailable')), 503);
  assert.equal(extractGeminiStatus(new Error('Retryable HTTP Error: Too Many Requests')), 429);
  assert.equal(extractGeminiStatus(new Error('Retryable HTTP Error: Internal Server Error')), 500);
});

test('retries a 503 once with exponential backoff and then returns success', async () => {
  let calls = 0;
  const delays = [];
  const result = await requestWithGeminiRetry(async () => {
    calls += 1;
    if (calls === 1) throw new Error('Retryable HTTP Error: Service Unavailable');
    return 'generated';
  }, { model: 'test-model', random: () => 0.5, sleep: async ms => delays.push(ms) });
  assert.equal(result, 'generated');
  assert.equal(calls, 2);
  assert.deepEqual(delays, [1000]);
});

test('stops after the initial request and three retries', async () => {
  let calls = 0;
  const delays = [];
  await assert.rejects(() => requestWithGeminiRetry(async () => {
    calls += 1;
    throw new Error('Retryable HTTP Error: Service Unavailable');
  }, { model: 'test-model', random: () => 0.5, sleep: async ms => delays.push(ms) }), error => {
    assert.equal(error.code, 'GEMINI_UNAVAILABLE');
    assert.equal(error.status, 503);
    return true;
  });
  assert.equal(calls, 4);
  assert.deepEqual(delays, [1000, 2000, 4000]);
});

test('does not retry permanent client errors', async () => {
  let calls = 0;
  await assert.rejects(() => requestWithGeminiRetry(async () => {
    calls += 1;
    const error = new Error('Bad Request');
    error.status = 400;
    throw error;
  }, { model: 'test-model', sleep: async () => assert.fail('must not sleep') }), error => {
    assert.equal(error.code, 'GEMINI_REQUEST_FAILED');
    assert.equal(error.status, 400);
    return true;
  });
  assert.equal(calls, 1);
});

test('retries temporary network failures and maps exhausted 429 responses', async () => {
  let calls = 0;
  const delays = [];
  await assert.rejects(() => requestWithGeminiRetry(async () => {
    calls += 1;
    const error = new Error('Retryable HTTP Error: Too Many Requests');
    throw error;
  }, { model: 'test-model', random: () => 0.5, sleep: async ms => delays.push(ms) }), error => {
    assert.equal(error.code, 'GEMINI_RATE_LIMIT');
    assert.equal(error.status, 429);
    return true;
  });
  assert.equal(calls, 4);
  assert.deepEqual(delays, [1000, 2000, 4000]);

  calls = 0;
  const networkDelays = [];
  assert.equal(await requestWithGeminiRetry(async () => {
    calls += 1;
    if (calls === 1) { const error = new Error('socket reset'); error.code = 'ECONNRESET'; throw error; }
    return 'ok';
  }, { model: 'test-model', random: () => 0.5, sleep: async ms => networkDelays.push(ms) }), 'ok');
  assert.deepEqual(networkDelays, [1000]);
});
