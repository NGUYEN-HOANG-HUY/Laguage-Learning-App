import assert from 'node:assert/strict';
import test from 'node:test';

import { sendRoleplayTurn } from './aiService.ts';

test('returns a context-specific restaurant response and marks the provider as mock', async () => {
  const result = await sendRoleplayTurn(
    'restaurant',
    "I'd like to order the chicken.",
  );

  assert.equal(result.provider, 'mock');
  assert.match(result.reply, /side dish or something to drink/i);
  assert.deepEqual(result.corrections, []);
});

test('uses conversation history to maintain the current topic', async () => {
  const result = await sendRoleplayTurn('restaurant', 'Yes, please.', [
    { role: 'assistant', text: 'Would you like to see the bill?' },
  ]);

  assert.match(result.reply, /before I bring the bill/i);
});

test('suggests clear corrections and returns no more than two', async () => {
  const result = await sendRoleplayTurn(
    'restaurant',
    'I am agree, I want order, and I very like soup.',
  );

  assert.equal(result.corrections.length, 2);
  assert.deepEqual(
    result.corrections.map((correction) => correction.corrected),
    ['I agree', "I'd like to order"],
  );
  assert.ok(result.corrections.every((correction) => correction.explanationVi));
});

test('responds differently in interview and office contexts', async () => {
  const interview = await sendRoleplayTurn(
    'interview',
    'I have three years of experience.',
  );
  const office = await sendRoleplayTurn('office', 'We need to discuss the deadline.');

  assert.match(interview.reply, /accomplishment/i);
  assert.match(office.reply, /meet that deadline/i);
});

test('rejects empty or overly long messages and invalid scenarios', async () => {
  await assert.rejects(
    sendRoleplayTurn('office', '   '),
    /nhập nội dung/,
  );
  await assert.rejects(
    sendRoleplayTurn('other', 'Hello'),
    /không hợp lệ/,
  );
  await assert.rejects(
    sendRoleplayTurn('office', 'x'.repeat(2001)),
    /2000 ký tự/,
  );
});
