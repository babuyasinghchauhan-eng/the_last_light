import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Terminal,
  ExternalLink,
  HardDrive,
  Flame,
  CheckCircle2,
  AlertTriangle,
  FileCode,
} from 'lucide-react';
import { webllmService, SUPPORTED_MODELS, WebGPUCapability } from '../../services/ai/webllmEngine';

export const InsideTheMachine: React.FC = () => {
  const [gpuInfo, setGpuInfo] = useState<WebGPUCapability | null>(null);
  const [storageEstimate, setStorageEstimate] = useState<{ usageMB: number; quotaMB: number } | null>(null);

  useEffect(() => {
    webllmService.checkWebGPUSupport().then(setGpuInfo);

    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        setStorageEstimate({
          usageMB: Math.round((est.usage || 0) / (1024 * 1024)),
          quotaMB: Math.round((est.quota || 0) / (1024 * 1024)),
        });
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="border-b border-[rgba(242,232,216,0.08)] pb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B89A61]">
          <Terminal className="w-4 h-4 text-[#F4B75E]" />
          <span>Hacktoberfest 2026 · Ghost in the Machine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#F2E8D8] mt-2">
          Inside the Machine
        </h1>
        <p className="text-sm text-[#A39686] mt-1 max-w-2xl leading-relaxed">
          How open-weight AI models run entirely inside your browser's WebGPU pipeline without cloud servers, telemetries, or privacy compromises.
        </p>
      </div>

      {/* Runtime Diagnostics Card */}
      <section className="p-6 rounded-xl bg-[#15120F] border border-[#382E24] space-y-4">
        <h2 className="font-serif text-xl font-medium text-[#F4B75E] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#E87932]" />
          <span>Device Runtime & WebGPU Diagnostics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#191512] border border-[#2B231C]">
            <span className="text-[#A39686] uppercase tracking-wider text-[10px] block">
              WebGPU Hardware Acceleration
            </span>
            <div className="mt-2 flex items-center gap-2">
              {gpuInfo?.supported ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-[#F2E8D8]">Supported & Available</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-medium text-amber-200">Unsupported or Disabled</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#736555] mt-1">
              {gpuInfo?.adapterInfo || gpuInfo?.reason || 'Detecting adapter...'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#191512] border border-[#2B231C]">
            <span className="text-[#A39686] uppercase tracking-wider text-[10px] block">
              Shader-f16 Capability
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-medium text-[#F2E8D8]">
                {gpuInfo?.hasShaderF16 ? 'Enabled (FP16 math)' : 'Fallback to FP32'}
              </span>
            </div>
            <p className="text-[11px] text-[#736555] mt-1">
              FP16 cuts VRAM requirements in half on modern GPUs.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#191512] border border-[#2B231C]">
            <span className="text-[#A39686] uppercase tracking-wider text-[10px] block">
              Local Browser Storage (Cache API)
            </span>
            <div className="mt-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#B89A61]" />
              <span className="font-mono text-[#F2E8D8] tabular-nums">
                {storageEstimate ? `${storageEstimate.usageMB} MB / ${storageEstimate.quotaMB} MB` : 'Estimating...'}
              </span>
            </div>
            <p className="text-[11px] text-[#736555] mt-1">
              Used for caching compiled weights for offline execution.
            </p>
          </div>
        </div>
      </section>

      {/* Why Local Inference Matters */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-normal text-[#F2E8D8]">
          Why Open Innovation & Local AI Matter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A39686] leading-relaxed">
          <div className="p-5 rounded-lg bg-[#15120F] border border-[#2B231C] space-y-2">
            <h3 className="font-medium text-[#F4B75E] text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Sovereignty Over Your Sacred Memories</span>
            </h3>
            <p>
              When honoring someone you loved—recording their quietest habits, personal recipes, or family stories—those memories should never become training data for commercial corporations or sit on centralized servers.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#15120F] border border-[#2B231C] space-y-2">
            <h3 className="font-medium text-[#F4B75E] text-sm flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span>Permanent Autonomy from Hosted APIs</span>
            </h3>
            <p>
              Hosted APIs change pricing, deprecate endpoints, enforce telemetry, or terminate services. An open-weight model compiled to WebAssembly and WebGPU belongs to you: it runs on an unplugged laptop in a quiet room fifty years from now.
            </p>
          </div>
        </div>
      </section>

      {/* The Architecture */}
      <section className="p-6 rounded-xl bg-[#15120F] border border-[#382E24] space-y-4">
        <h2 className="font-serif text-xl font-medium text-[#F4B75E]">
          How The Inference Pipeline Works
        </h2>

        <div className="space-y-4 text-xs text-[#A39686] leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[#241B12] text-[#F4B75E] font-mono shrink-0">1</span>
            <div>
              <strong className="text-[#F2E8D8]">Model Quantization:</strong> Weights are 4-bit AWQ quantized into small shards (~400MB–900MB total) optimized for fast loading and reduced memory footprints.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[#241B12] text-[#F4B75E] font-mono shrink-0">2</span>
            <div>
              <strong className="text-[#F2E8D8]">Cache & Offline Retention:</strong> The browser's native Cache API and Origin Private File System (OPFS) store the model shards locally upon initial download. Subsequent runs do not require an internet connection.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[#241B12] text-[#F4B75E] font-mono shrink-0">3</span>
            <div>
              <strong className="text-[#F2E8D8]">Apache TVM WebAssembly Engine:</strong> Compiled WASM executes the tokenizer and schedule loop on the CPU, while tensor contractions (matrix multiplications) dispatch to your GPU via WGSL shaders.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[#241B12] text-[#F4B75E] font-mono shrink-0">4</span>
            <div>
              <strong className="text-[#F2E8D8]">Zero Network Exfiltration:</strong> The network tab during inference reveals zero outbound POST requests. Every token is computed in your device's memory.
            </div>
          </div>
        </div>
      </section>

      {/* Supported Models & Verified Licenses */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-normal text-[#F2E8D8]">
          Supported Open-Weight Models & Licenses
        </h2>

        <div className="space-y-3">
          {SUPPORTED_MODELS.map((model) => (
            <div
              key={model.id}
              className="p-4 rounded-lg bg-[#15120F] border border-[#2B231C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#F2E8D8] text-sm">{model.name}</span>
                  {model.isRecommended && (
                    <span className="text-[10px] text-[#090807] bg-[#F4B75E] px-1.5 py-0.5 rounded font-medium">
                      Recommended
                    </span>
                  )}
                  {model.isLowResource && (
                    <span className="text-[10px] text-[#A39686] border border-[#382E24] px-1.5 py-0.5 rounded">
                      Low VRAM
                    </span>
                  )}
                </div>
                <p className="text-[#A39686]">{model.description}</p>
                <div className="text-[11px] text-[#736555] flex items-center gap-3">
                  <span>Download: {model.downloadSizeApprox}</span>
                  <span>·</span>
                  <span>VRAM: {model.vramRequiredMB} MB</span>
                  <span>·</span>
                  <span>License: {model.license}</span>
                </div>
              </div>

              <a
                href={model.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#F4B75E] hover:underline shrink-0 text-xs"
              >
                <span>View License</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Links & Attribution */}
      <section className="pt-4 border-t border-[rgba(242,232,216,0.08)] flex flex-wrap items-center justify-between gap-4 text-xs text-[#A39686]">
        <span>Built for Hacktoberfest 2026: “Ghost in the Machine”</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mlc-ai/web-llm"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#F4B75E] flex items-center gap-1"
          >
            <span>MLC WebLLM</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://huggingface.co/Qwen"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#F4B75E] flex items-center gap-1"
          >
            <span>Qwen Team</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://tvm.apache.org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#F4B75E] flex items-center gap-1"
          >
            <span>Apache TVM Unity</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </div>
  );
};
