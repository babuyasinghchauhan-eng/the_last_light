import { describe, it, expect } from 'vitest';
import { BackupData, Memory } from '../types/memory';
import { INITIAL_FICTIONAL_MEMORIES } from '../data/sampleMemories';

describe('Storage and Backup Validation', () => {
  it('validates that initial fictional samples have required fields and sample labels', () => {
    expect(INITIAL_FICTIONAL_MEMORIES.length).toBeGreaterThanOrEqual(3);
    for (const mem of INITIAL_FICTIONAL_MEMORIES) {
      expect(mem.id).toBeDefined();
      expect(mem.personName.length).toBeGreaterThan(0);
      expect(mem.story.length).toBeGreaterThan(0);
      expect(mem.isFictionalSample).toBe(true);
      expect(mem.photoUrl).toBeDefined();
    }
  });

  it('validates backup schema structure', () => {
    const backup: BackupData = {
      version: 1,
      appName: 'The Last Light — Offline AI Memory Keeper',
      exportedAt: new Date().toISOString(),
      memories: INITIAL_FICTIONAL_MEMORIES,
      altarItems: [],
      settings: {},
    };

    expect(backup.version).toBe(1);
    expect(Array.isArray(backup.memories)).toBe(true);
    expect(backup.memories[0].personName).toBe('Sofía Elena Morales');
  });
});
