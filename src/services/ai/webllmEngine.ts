import {
  CreateMLCEngine,
  MLCEngine,
  InitProgressReport,
} from '@mlc-ai/web-llm';
import { ModelOption, ModelState, ModelProgressReport } from '../../types/memory';

export const SUPPORTED_MODELS: ModelOption[] = [
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 — 1.5B Instruct (q4f16)',
    description:
      'Recommended. Rich emotional nuances, excellent poetic meter, and compassionate phrasing.',
    vramRequiredMB: 1629,
    downloadSizeApprox: '~950 MB',
    license: 'Qwen Research & Commercial License (Apache 2.0 derived)',
    licenseUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct',
    isRecommended: true,
  },
  {
    id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 — 0.5B Instruct (q4f16)',
    description:
      'Ultra-compact. Fast download, minimal VRAM footprint, ideal for laptops and lightweight devices.',
    vramRequiredMB: 944,
    downloadSizeApprox: '~400 MB',
    license: 'Apache 2.0',
    licenseUrl: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct',
    isLowResource: true,
  },
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 — 360M Instruct (q4f16)',
    description:
      'Smallest footprint model. Extremely low memory requirements (~376 MB VRAM).',
    vramRequiredMB: 376,
    downloadSizeApprox: '~230 MB',
    license: 'Apache 2.0',
    licenseUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct',
    isLowResource: true,
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 — 1B Instruct (q4f16)',
    description:
      'Meta open-weight model with strong narrative voice and lyrical storytelling.',
    vramRequiredMB: 879,
    downloadSizeApprox: '~750 MB',
    license: 'Llama 3.2 Community License',
    licenseUrl: 'https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct',
  },
];

export interface WebGPUCapability {
  supported: boolean;
  hasShaderF16: boolean;
  adapterInfo?: string;
  reason?: string;
}

class WebLLMService {
  private engine: MLCEngine | null = null;
  private currentModelId: string | null = null;
  private state: ModelState = 'unloaded';
  private statusListeners: Set<(state: ModelState, report?: ModelProgressReport) => void> = new Set();
  private abortRequested = false;

  public subscribe(listener: (state: ModelState, report?: ModelProgressReport) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.state);
    return () => this.statusListeners.delete(listener);
  }

  private notify(state: ModelState, report?: ModelProgressReport) {
    this.state = state;
    for (const listener of this.statusListeners) {
      try {
        listener(state, report);
      } catch (err) {
        console.error('Error in listener notification:', err);
      }
    }
  }

  public getState(): ModelState {
    return this.state;
  }

  public getCurrentModelId(): string | null {
    return this.currentModelId;
  }

  public async checkWebGPUSupport(): Promise<WebGPUCapability> {
    if (typeof window === 'undefined' || !navigator) {
      return { supported: false, hasShaderF16: false, reason: 'Non-browser environment' };
    }

    if (!('gpu' in navigator) || !navigator.gpu) {
      return {
        supported: false,
        hasShaderF16: false,
        reason:
          'WebGPU is not enabled or supported in this browser. Please use Chrome 113+, Edge 113+, or enable WebGPU flags.',
      };
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        return {
          supported: false,
          hasShaderF16: false,
          reason: 'No compatible WebGPU hardware graphics adapter found.',
        };
      }

      const hasShaderF16 = adapter.features.has('shader-f16');
      let adapterInfo = 'Standard GPU Device';
      try {
        if ('requestAdapterInfo' in adapter) {
          // @ts-expect-error adapter info API difference across browsers
          const info = await adapter.requestAdapterInfo();
          if (info && (info.vendor || info.architecture)) {
            adapterInfo = `${info.vendor || ''} ${info.architecture || ''}`.trim();
          }
        }
      } catch {
        // adapter info is optional
      }

      return {
        supported: true,
        hasShaderF16,
        adapterInfo,
      };
    } catch (err) {
      return {
        supported: false,
        hasShaderF16: false,
        reason: err instanceof Error ? err.message : 'WebGPU adapter query failed.',
      };
    }
  }

  public async initializeModel(
    modelId: string = SUPPORTED_MODELS[0].id,
    onProgress?: (report: ModelProgressReport) => void
  ): Promise<void> {
    if (this.engine && this.currentModelId === modelId && this.state === 'ready') {
      return;
    }

    this.notify('checking');

    // 1. Check WebGPU
    const gpuCheck = await this.checkWebGPUSupport();
    if (!gpuCheck.supported) {
      this.notify('unsupported', {
        text: gpuCheck.reason || 'WebGPU not supported on this device.',
        progress: 0,
      });
      throw new Error(gpuCheck.reason || 'WebGPU is not supported.');
    }

    // Adapt to 32-bit float model if f16 shaders are not supported on this adapter
    let targetModelId = modelId;
    if (!gpuCheck.hasShaderF16 && modelId.includes('q4f16_1')) {
      const f32Variant = modelId.replace('q4f16_1', 'q4f32_1');
      console.log(`Device lacks shader-f16; adapting to ${f32Variant}`);
      targetModelId = f32Variant;
    }

    this.notify('downloading', { text: 'Contacting local model cache...', progress: 0.05 });

    try {
      this.abortRequested = false;

      const progressCallback = (report: InitProgressReport) => {
        const parsedReport: ModelProgressReport = {
          text: report.text,
          progress: report.progress || 0,
          timeElapsed: report.timeElapsed,
        };
        this.notify('downloading', parsedReport);
        if (onProgress) onProgress(parsedReport);
      };

      // Create engine singleton
      this.engine = await CreateMLCEngine(targetModelId, {
        initProgressCallback: progressCallback,
        logLevel: 'INFO',
      });

      this.currentModelId = targetModelId;
      this.notify('ready', { text: 'Model weights compiled to WebGPU and ready.', progress: 1 });
    } catch (err) {
      this.currentModelId = null;
      this.engine = null;
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize local model.';
      console.error('WebLLM initialization error:', err);
      this.notify('error', { text: errorMsg, progress: 0 });
      throw new Error(errorMsg);
    }
  }

  public async generateStory(
    systemPrompt: string,
    userPrompt: string,
    onToken?: (token: string, fullText: string) => void
  ): Promise<string> {
    if (!this.engine || this.state !== 'ready') {
      throw new Error('Local AI engine is not ready. Please initialize a model first.');
    }

    this.notify('generating');
    this.abortRequested = false;

    try {
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt },
      ];

      const stream = await this.engine.chat.completions.create({
        messages,
        temperature: 0.75,
        max_tokens: 1200,
        stream: true,
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        if (this.abortRequested) {
          if (this.engine.interruptGenerate) {
            await this.engine.interruptGenerate();
          }
          break;
        }

        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullResponse += delta;
          if (onToken) onToken(delta, fullResponse);
        }
      }

      this.notify('ready');
      return fullResponse.trim();
    } catch (err) {
      this.notify('ready');
      const errorMsg = err instanceof Error ? err.message : 'Generation interrupted or failed.';
      console.error('Generation failure:', err);
      throw new Error(errorMsg);
    }
  }

  public stopGeneration() {
    this.abortRequested = true;
    if (this.engine && this.engine.interruptGenerate) {
      this.engine.interruptGenerate().catch(() => {});
    }
  }

  public async unloadModel() {
    if (this.engine) {
      try {
        await this.engine.unload();
      } catch (e) {
        console.warn('Error unloading engine:', e);
      }
      this.engine = null;
    }
    this.currentModelId = null;
    this.notify('unloaded');
  }
}

export const webllmService = new WebLLMService();
