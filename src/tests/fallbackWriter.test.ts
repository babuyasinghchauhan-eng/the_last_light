import { describe, it, expect } from 'vitest';
import { generateTemplateDraft } from '../services/ai/fallbackWriter';
import { Memory } from '../types/memory';

describe('Fallback Creative Template Synthesizer', () => {
  const sampleMemory: Partial<Memory> = {
    personName: 'Mateo Navarro',
    relationship: 'Uncle & Guitarist',
    story: 'He played late sessions at basement clubs where the walls sweat.',
    favoriteFood: 'Café de olla and midnight churros',
    favoriteSong: 'Round Midnight',
    favoritePlace: 'The fire escape overlooking the avenue',
    sayings: 'If your song doesn’t tell a secret, why wake the strings?',
  };

  it('generates a letter with correct personal attributes', () => {
    const result = generateTemplateDraft(sampleMemory, 'letter', 'tender');
    expect(result.content).toContain('Dearest Mateo Navarro');
    expect(result.content).toContain('Café de olla and midnight churros');
    expect(result.content).toContain('Round Midnight');
    expect(result.content).toContain('The fire escape overlooking the avenue');
    expect(result.label).toContain('Locally Synthesized Template');
  });

  it('generates a poem preserving meaningful sayings', () => {
    const result = generateTemplateDraft(sampleMemory, 'poem', 'poetic');
    expect(result.content).toContain('If your song doesn’t tell a secret, why wake the strings?');
    expect(result.content).toContain('The candle burns, the marigold blooms');
  });

  it('generates an archival family history chronicle', () => {
    const result = generateTemplateDraft(sampleMemory, 'family_history', 'tender');
    expect(result.content).toContain('AN ARCHIVAL RECORD OF REMEMBRANCE: MATEO NAVARRO');
    expect(result.content).toContain('TESTAMENT FOR FUTURE GENERATIONS');
  });
});
