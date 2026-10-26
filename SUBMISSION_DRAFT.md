# The Last Light: I Built an Offline AI Memory Keeper for Ghosts in the Machine

*A submission for the Hacktoberfest 2026 Open-Source AI Challenge, Week 4: “Ghost in the Machine”.*

---

## What I Built

**The Last Light** is an offline, privacy-first digital memorial and creative storytelling studio. It was inspired by the quiet nostalgia of late autumn, the remembrance traditions of Día de los Muertos, and the tactile stories families pass down through the years.

Instead of sending deeply personal stories, family photographs, and vulnerable memories of lost loved ones or childhood companions to a hosted commercial AI cloud, **The Last Light runs an open-weight language model (Qwen 2.5) directly inside your web browser using WebGPU**.

### Key Highlights:
- **The Digital Ofrenda:** An interactive, three-tiered remembrance altar with flickering virtual candles, botanical cempasúchil marigolds, and framed photographs.
- **The Memory Archive:** A private, client-side repository storing stories, favorite recipes, songs, sanctuary places, and memorable sayings in browser IndexedDB.
- **“Let the Memory Speak” Studio:** Transforms recorded memories into gentle first-person remembrances, letters, autumn ghost stories, or poems using in-browser open-weight neural weights.
- **100% Offline After First Download:** Once the quantized weights are cached via the browser's Cache API / OPFS, no internet connection is required.
- **Procedural Soundscape:** A built-in Web Audio API synthesizer that produces gentle hearth candle crackles and meditative windchimes without external audio assets.
- **Zero-Pill Museum Catalog Aesthetics:** Near-black background (`#090807`), warm ivory text (`#F2E8D8`), candlelight amber (`#F4B75E`), and restrained typography.

---

## Demo

- **Live Application:** [DEPLOYED_APP_URL_PLACEHOLDER] *(Add after publishing on Cloud Run / Vercel / GitHub Pages)*
- **Preview Video / Walkthrough:** [DEMO_VIDEO_URL_PLACEHOLDER]

---

## Code

- **GitHub Repository:** [GITHUB_REPO_URL_PLACEHOLDER]
- **License:** MIT License (with model weights governed by the Qwen Research License & Apache 2.0)

---

## How I Built It

### 1. In-Browser Open-Weight Inference with WebLLM & WebGPU
Rather than making network requests to proprietary hosted APIs, I integrated `@mlc-ai/web-llm`. WebLLM compiles 4-bit quantized open-weight models (specifically `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` and `Qwen2.5-0.5B-Instruct-q4f16_1-MLC`) into WebAssembly and WGSL (WebGPU Shading Language) compute shaders.

During inference, matrix multiplications run directly on the user's local GPU. Opening your browser's DevTools Network panel confirms that **zero token requests are sent over the wire**.

### 2. Honest Fallbacks & Hardware Detection
WebGPU is supported on modern desktop browsers (Chrome 113+, Edge 113+, Firefox Nightly), but mobile or older hardware may lack support.
Rather than faking responses or crashing, the engine:
1. Queries `navigator.gpu` and inspects adapter features (like `shader-f16`).
2. If `shader-f16` is unavailable, it automatically switches to 32-bit float model variants (`q4f32_1`).
3. If WebGPU is entirely unavailable, the app remains 100% functional for memory archival, altar curation, and data export, offering a clearly labeled, deterministic template-assisted composition mode.

### 3. Local-First Persistence with IndexedDB
Memories, sensory touchstones, and photo data URLs are persisted in browser **IndexedDB** (`TheLastLightDB`). A complete backup system allows users to export and import their entire library as a structured JSON file at any time.

### 4. Ethical Remembrance Guardrails
A core design requirement was that the AI must never claim to be communicating with spirits or deceased persons. The system prompt enforces strict rules:
- Factual fidelity: Preserve names, dates, recipes, and songs without fabricating fictional family tragedies.
- Poetic framing: First-person remembance is treated explicitly as a fictional literary device honoring their life.
- Transparent origin: Generated text is clearly labeled with the exact model used.

---

## Why Does Open Innovation Matter?

Open innovation is not just about code licenses; it is about **human sovereignty**.

When someone writes about an abuela who measured flour by the palm of her hand, or a dog that guarded the sunny patch on the rug, those words represent love, vulnerability, and grief. Sending those intimate moments to a centralized corporation where they may be stored, analyzed, or ingested into training corpuses is an unacceptable trade-off.

Open-weight models and browser-native inference change the power dynamic. An open model running on your laptop in an airplane, in a cabin, or fifty years from now when commercial APIs have shut down, remains completely yours. Open innovation ensures our tools outlast corporate roadmaps.

---

## My Agent Session

*Note: Add details here about your specific AI Studio Build or agent session workflow, including how the interface was iteratively designed and tested.*

- Initial architecture and domain constitution defined around museum-grade editorial layouts.
- In-browser model verification using WebLLM prebuilt model registry.
- Implementation of the procedural Web Audio ambient soundscape and canvas ember particles.
- Verification of test suites for prompt formatting, storage validation, and fallback templates.

---

## The Spirit of It

*“Ghost in the Machine”* often connotes something eerie or malfunctioning. But for this project, the “ghost” is something gentler: the persistent presence of the people, companions, and moments that shaped who we are.

Technology often rushes us into the future, discarding what came before. The Last Light was built to do the opposite: to let modern hardware pause, strike a match, and leave a quiet light burning for the stories we refuse to lose.

---

## Prize Categories

- **Primary Track:** Hacktoberfest 2026 Open-Source AI Challenge, Week 4: “Ghost in the Machine”
- *(Reminder: Verify actual eligibility and partner tracks against the official challenge rules before submitting!)*
