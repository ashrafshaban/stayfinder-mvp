/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /** `api` (default) or `mock` */
  readonly VITE_DATA_SOURCE?: "api" | "mock";
  /** Legacy flag — use VITE_DATA_SOURCE=mock instead */
  readonly VITE_USE_MOCK_API?: string;
  /** Simulated network delay for mock layer (ms). Default: 350 */
  readonly VITE_MOCK_LATENCY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
