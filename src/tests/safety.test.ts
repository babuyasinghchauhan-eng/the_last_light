import { describe, it, expect } from 'vitest';
import { buildPromptForMemory, SYSTEM_ETHICS_INSTRUCTIONS } from '../services/ai/safety';
import { Memory } from '../types/memory';

describe('AI Safety and Prompt Architecture', () => {
  it('enforces that ethics guidelines forbid claiming to be deceased or medium', () => {
    expect(SYSTEM_ETHICS_INSTRUCTIONS).toContain('NEVER a medium, spirit, or ghost');
    expect(SYSTEM_ETHICS_INSTRUCTIONS).toContain('Strictly preserve the factual details');
    expect(SYSTEM_ETHICS_INSTRUCTIONS).toContain('No Manipulative Predictions');
  });

  it('constructs a prompt containing all user provided touchstones', () => {
    const memory: Partial<Memory> = {
      personName: 'Sofía Elena Morales',
      relationship: 'Abuela',
      birthDate: '1938-04-12',
      remembranceDate: '2021-11-03',
      title: 'The Scent of Anise',
      story: 'She loved baking early in the dawn with flour on her apron.',
      favoriteFood: 'Pan de muerto with cinnamon hot chocolate',
      favoriteSong: 'Sabor a Mí',
      favoritePlace: 'Porch garden in Oaxaca',
      sayings: 'Never worry about what has no remedy.',
    };

    const { system, user } = buildPromptForMemory(memory, 'remembrance', 'tender');

    expect(system).toBe(SYSTEM_ETHICS_INSTRUCTIONS);
    expect(user).toContain('Subject: Sofía Elena Morales');
    expect(user).toContain('Relationship: Abuela');
    expect(user).toContain('Dates: 1938-04-12 to 2021-11-03');
    expect(user).toContain('Pan de muerto with cinnamon hot chocolate');
    expect(user).toContain('Sabor a Mí');
    expect(user).toContain('Porch garden in Oaxaca');
    expect(user).toContain('Never worry about what has no remedy.');
    expect(user).toContain('Tone: Deeply gentle, compassionate, soft-spoken, and affectionate.');
  });
});
