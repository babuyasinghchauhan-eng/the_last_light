# THE LAST LIGHT — An Offline AI Memory Keeper

> *“Some things disappear from the world. They don't have to disappear from our stories.”*

Built for **Hacktoberfest 2026: Open-Source AI Challenge — Week 4: “Ghost in the Machine”**.

**The Last Light** is a private, local-first digital memorial and storytelling sanctuary inspired by the quiet reverence of autumn, the living remembrance traditions of Día de los Muertos, and the stories families carry across generations.

Instead of sending sacred personal memories, photographs, and family grief to remote commercial AI servers, **The Last Light** executes open-weight instruction models directly inside the user's browser using **WebGPU** and **WebAssembly**.

---

## ✦ Core Features

1. **The Digital Ofrenda (Remembrance Altar)**
   - Interactive, three-tiered remembrance altar with candlelight, golden cempasúchil marigolds, and bread of the dead (*pan de muerto*).
   - Click candles to light or extinguish organic flickering flames with synthesized hearth crackles and meditative windchime audio (synthesized via Web Audio API, requiring zero audio assets).
   - Place, reposition, or enshrine framed photographs and dedications.

2. **The Memory Archive**
   - Private, client-side store preserving names, dates, recipes, favorite songs, sanctuaries, sayings, and photographs.
   - Filter by tags, search by keywords, and sort alphabetically or chronologically.
   - Zero-pill museum catalog presentation adhering to strict typographic hierarchy.

3. **“Let the Memory Speak” Writing Studio**
   - In-browser open-weight model generation via `@mlc-ai/web-llm`.
   - Five distinct literary formats:
     - *First-Person Remembrance:* A lyrical monologue spoken in the warmth of memory.
     - *Gentle Letter:* Heartfelt words of love and gratitude.
     - *Autumn Fireside Story:* A gentle gothic tale woven from recorded details.
     - *Poem of Remembrance:* A 4–6 stanza lyric preserving tactile details.
     - *Family Chronicle:* An archival prose record for future generations.
   - Tones: *Tender*, *Nostalgic*, *Hopeful*, *Mysterious*, or *Poetic*.
   - Streaming responses directly from WebGPU shaders with live progress, pause/stop, editing, and copy controls.

4. **100% Local-First Data Sovereignty**
   - All memories and photos remain in browser **IndexedDB**.
   - No user accounts, logins, telemetry, or remote tracking.
   - Backup & restore: Complete JSON backup with embedded base64 photographs.

5. **PWA & Offline Capability**
   - Installable Progressive Web App (PWA) with desktop and mobile home screen support.
   - First visit downloads the model weights; subsequent visits run entirely offline when cached.

---

## ✦ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                   THE LAST LIGHT                        │
│            React 19 + TypeScript + Vite                │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌─────────────────────────┐         ┌────────────────────┐
│   Private Storage       │         │ In-Browser WebLLM  │
│   • IndexedDB           │         │ • WebGPU Shaders   │
│   • Local Photos (Data) │         │ • Apache TVM WASM  │
│   • JSON Portability    │         │ • Qwen 2.5 1.5B/0.5B│
└─────────────────────────┘         └────────────────────┘
```

- **Framework:** React 19, TypeScript, Vite 8, Tailwind CSS v4.
- **Local AI Engine:** `@mlc-ai/web-llm` running quantized open-weight models via WebGPU.
- **Storage:** Browser-native IndexedDB for memories, photos, and altar arrangements.
- **Audio:** Web Audio API procedural synthesis (pink noise hearth crackle + pentatonic chimes).
- **Offline / PWA:** `vite-plugin-pwa` with Cache API and OPFS retention.

---

## ✦ Exact AI Models & Licenses

The Last Light uses verified open-weight models from the official MLC WebLLM registry:

| Model Identifier | VRAM Required | Approx. Size | License |
| :--- | :--- | :--- | :--- |
| **`Qwen2.5-1.5B-Instruct-q4f16_1-MLC`** *(Recommended)* | ~1629 MB | ~950 MB | [Qwen Research & Commercial License](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct) (Apache 2.0 based) |
| **`Qwen2.5-0.5B-Instruct-q4f16_1-MLC`** *(Low VRAM)* | ~944 MB | ~400 MB | [Apache 2.0](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct) |
| **`SmolLM2-360M-Instruct-q4f16_1-MLC`** *(Ultra-Light)* | ~376 MB | ~230 MB | [Apache 2.0](https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct) |
| **`Llama-3.2-1B-Instruct-q4f16_1-MLC`** | ~879 MB | ~750 MB | [Llama 3.2 Community License](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) |

*Device Compatibility Note:* When running on GPUs lacking the `shader-f16` extension, the engine automatically selects the 32-bit float (`q4f32_1`) variant.

---

## ✦ Why Open Innovation Matters

In an era dominated by proprietary, hosted AI models behind corporate paywalls and API meters, private human remembrance is too sacred to surrender to a remote server.

1. **Memory Sovereignty:** You should not need an internet connection, a subscription, or an API key to remember your grandmother's recipe or your childhood companion.
2. **Longevity:** Hosted APIs change endpoints, update safety classifiers that mistakenly censor grief, or terminate services. An open-weight model compiled to WebAssembly and WebGPU belongs to you indefinitely.
3. **Inspectability:** Anyone can audit the network tab. Not a single byte of your story is transmitted over the wire.

---

## ✦ Getting Started

### Prerequisites

- Node.js 18+ (tested on Node v22)
- A browser supporting **WebGPU** (Google Chrome 113+, Microsoft Edge 113+, or Firefox Nightly with `dom.webgpu.enabled`).

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/the-last-light.git
cd the-last-light

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your WebGPU-enabled browser.

### Running Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
npm run preview
```

---

## ✦ Ethical Remembrance Commitment

The Last Light enforces strict ethical guardrails in its prompt architecture:
- **No Mediumship / Spiritualist Claims:** The system explicitly instructs the model never to claim it is communicating with deceased souls or possessing supernatural powers.
- **Factual Fidelity:** The model is instructed to preserve and honor the exact names, foods, songs, and moments provided by the storyteller without fabricating biographical tragedies.
- **Transparent Demarcation:** All generated passages are clearly marked as creative literary interpretations.

---

## ✦ Connecting to GitHub from Google AI Studio

1. In the Google AI Studio Build UI, open the top-right header menu.
2. Click **Export to GitHub** or **Connect Repository**.
3. Authorize your GitHub account and specify your repository name (e.g. `the-last-light`).
4. Commit your changes and trigger continuous deployment.

---

## ✦ License

This project is licensed under the [MIT License](LICENSE).
Open-weight model weights are subject to their respective licenses (Qwen License, Apache 2.0, Meta Llama Community License).
