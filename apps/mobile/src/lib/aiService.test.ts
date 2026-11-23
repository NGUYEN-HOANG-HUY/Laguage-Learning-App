import { describe, expect, it } from 'vitest';

import { sendRoleplayTurn } from './aiService';

describe('Mock AI roleplay service', () => {
  it('returns a scenario-specific reply and marks the provider as mock', async () => {
    const result = await sendRoleplayTurn('interview', 'I have five years of experience.');

    expect(result.provider).toBe('mock');
    expect(result.reply).toContain('strength');
    expect(result.corrections).toEqual([]);
  });

  it('returns a concrete correction for a supported grammar pattern', async () => {
    const result = await sendRoleplayTurn('restaurant', 'I am agree with that.');

    expect(result.corrections).toEqual([
      {
        original: 'I am agree',
        corrected: 'I agree',
        explanationVi: '“Agree” là động từ nên không dùng “am” ở trước.',
      },
    ]);
  });

  it('rejects empty messages and unknown scenarios', async () => {
    await expect(sendRoleplayTurn('office', '  ')).rejects.toThrow('nhập nội dung');
    await expect(
      sendRoleplayTurn('unknown' as 'office', 'Hello'),
    ).rejects.toThrow('không hợp lệ');
  });
});
