import { Memory, AltarItem, BackupData } from '../../types/memory';
import { INITIAL_FICTIONAL_MEMORIES, INITIAL_ALTAR_ITEMS } from '../../data/sampleMemories';

const DB_NAME = 'TheLastLightDB';
const DB_VERSION = 1;
const STORE_MEMORIES = 'memories';
const STORE_ALTAR = 'altar_items';

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryFallback: Map<string, Memory> = new Map();
  private altarFallback: Map<string, AltarItem> = new Map();
  private isUsingFallback = false;

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        this.isUsingFallback = true;
        reject(new Error('IndexedDB is not available in this browser environment.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_MEMORIES)) {
          const memoryStore = db.createObjectStore(STORE_MEMORIES, { keyPath: 'id' });
          memoryStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          memoryStore.createIndex('onAltar', 'onAltar', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_ALTAR)) {
          db.createObjectStore(STORE_ALTAR, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB failed to open, falling back to memory storage:', event);
        this.isUsingFallback = true;
        reject(new Error('Failed to open IndexedDB database.'));
      };
    });

    return this.dbPromise;
  }

  public async getAllMemories(): Promise<Memory[]> {
    try {
      const db = await this.initDB();
      return new Promise<Memory[]>((resolve, reject) => {
        const tx = db.transaction(STORE_MEMORIES, 'readonly');
        const store = tx.objectStore(STORE_MEMORIES);
        const req = store.getAll();

        req.onsuccess = async () => {
          let results: Memory[] = req.result || [];
          if (results.length === 0) {
            // Seed fictional demonstration samples
            await this.seedInitialData();
            results = [...INITIAL_FICTIONAL_MEMORIES];
          }
          resolve(results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        };

        req.onerror = () => reject(req.error);
      });
    } catch {
      if (this.memoryFallback.size === 0) {
        INITIAL_FICTIONAL_MEMORIES.forEach((m) => this.memoryFallback.set(m.id, m));
      }
      return Array.from(this.memoryFallback.values()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
  }

  public async getMemory(id: string): Promise<Memory | undefined> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_MEMORIES, 'readonly');
        const store = tx.objectStore(STORE_MEMORIES);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.memoryFallback.get(id);
    }
  }

  public async saveMemory(memory: Memory): Promise<Memory> {
    const memoryToSave = {
      ...memory,
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_MEMORIES, 'readwrite');
        const store = tx.objectStore(STORE_MEMORIES);
        const req = store.put(memoryToSave);
        req.onsuccess = () => resolve(memoryToSave);
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.memoryFallback.set(memoryToSave.id, memoryToSave);
      return memoryToSave;
    }
  }

  public async deleteMemory(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORE_MEMORIES, STORE_ALTAR], 'readwrite');
        const memoryStore = tx.objectStore(STORE_MEMORIES);
        const altarStore = tx.objectStore(STORE_ALTAR);

        memoryStore.delete(id);

        // Also remove from altar if exists
        const altarReq = altarStore.getAll();
        altarReq.onsuccess = () => {
          const items: AltarItem[] = altarReq.result || [];
          const matched = items.find((item) => item.memoryId === id);
          if (matched) {
            altarStore.delete(matched.id);
          }
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      this.memoryFallback.delete(id);
      for (const [itemId, item] of this.altarFallback.entries()) {
        if (item.memoryId === id) this.altarFallback.delete(itemId);
      }
    }
  }

  public async getAllAltarItems(): Promise<AltarItem[]> {
    try {
      const db = await this.initDB();
      return new Promise<AltarItem[]>((resolve, reject) => {
        const tx = db.transaction(STORE_ALTAR, 'readonly');
        const store = tx.objectStore(STORE_ALTAR);
        const req = store.getAll();

        req.onsuccess = async () => {
          let results: AltarItem[] = req.result || [];
          if (results.length === 0) {
            await this.seedInitialAltar();
            results = [...INITIAL_ALTAR_ITEMS];
          }
          resolve(results);
        };

        req.onerror = () => reject(req.error);
      });
    } catch {
      if (this.altarFallback.size === 0) {
        INITIAL_ALTAR_ITEMS.forEach((item) => this.altarFallback.set(item.id, item));
      }
      return Array.from(this.altarFallback.values());
    }
  }

  public async saveAltarItem(item: AltarItem): Promise<AltarItem> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_ALTAR, 'readwrite');
        const store = tx.objectStore(STORE_ALTAR);
        const req = store.put(item);
        req.onsuccess = () => resolve(item);
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.altarFallback.set(item.id, item);
      return item;
    }
  }

  public async deleteAltarItem(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_ALTAR, 'readwrite');
        const store = tx.objectStore(STORE_ALTAR);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.altarFallback.delete(id);
    }
  }

  public async resetAltar(): Promise<AltarItem[]> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_ALTAR, 'readwrite');
        const store = tx.objectStore(STORE_ALTAR);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      await this.seedInitialAltar();
      return [...INITIAL_ALTAR_ITEMS];
    } catch {
      this.altarFallback.clear();
      INITIAL_ALTAR_ITEMS.forEach((item) => this.altarFallback.set(item.id, item));
      return Array.from(this.altarFallback.values());
    }
  }

  public async clearAllData(): Promise<void> {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORE_MEMORIES, STORE_ALTAR], 'readwrite');
        tx.objectStore(STORE_MEMORIES).clear();
        tx.objectStore(STORE_ALTAR).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      this.memoryFallback.clear();
      this.altarFallback.clear();
    }
  }

  public async seedInitialData(): Promise<void> {
    try {
      const db = await this.initDB();
      const tx = db.transaction([STORE_MEMORIES, STORE_ALTAR], 'readwrite');
      const memStore = tx.objectStore(STORE_MEMORIES);
      const altarStore = tx.objectStore(STORE_ALTAR);

      for (const m of INITIAL_FICTIONAL_MEMORIES) {
        memStore.put(m);
      }
      for (const item of INITIAL_ALTAR_ITEMS) {
        altarStore.put(item);
      }
    } catch (err) {
      console.warn('Seeding initial data into memory fallback:', err);
      INITIAL_FICTIONAL_MEMORIES.forEach((m) => this.memoryFallback.set(m.id, m));
      INITIAL_ALTAR_ITEMS.forEach((item) => this.altarFallback.set(item.id, item));
    }
  }

  private async seedInitialAltar(): Promise<void> {
    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_ALTAR, 'readwrite');
      const store = tx.objectStore(STORE_ALTAR);
      for (const item of INITIAL_ALTAR_ITEMS) {
        store.put(item);
      }
    } catch {
      INITIAL_ALTAR_ITEMS.forEach((item) => this.altarFallback.set(item.id, item));
    }
  }

  public async exportBackup(): Promise<BackupData> {
    const memories = await this.getAllMemories();
    const altarItems = await this.getAllAltarItems();

    return {
      version: 1,
      appName: 'The Last Light — Offline AI Memory Keeper',
      exportedAt: new Date().toISOString(),
      memories,
      altarItems,
      settings: {},
    };
  }

  public async importBackup(backup: BackupData, mergeMode: 'merge' | 'replace'): Promise<{ importedCount: number }> {
    if (!backup || !Array.isArray(backup.memories)) {
      throw new Error('Invalid backup file structure: missing memories array.');
    }

    if (mergeMode === 'replace') {
      await this.clearAllData();
    }

    let count = 0;
    for (const mem of backup.memories) {
      if (mem && mem.id && mem.personName && mem.title) {
        await this.saveMemory(mem);
        count++;
      }
    }

    if (Array.isArray(backup.altarItems)) {
      for (const item of backup.altarItems) {
        if (item && item.id && item.type) {
          await this.saveAltarItem(item);
        }
      }
    }

    return { importedCount: count };
  }
}

export const storageService = new StorageService();
