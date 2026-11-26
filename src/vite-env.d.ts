/// <reference types="vite/client" />

/**
 * Custom environment variables interface for VayuMitra.
 * Strongly types `import.meta.env` to prevent `any` usage.
 */
interface ImportMetaEnv {
  /** Optional Google Gemini API key provided at build or deployment time */
  readonly VITE_GEMINI_API_KEY?: string;
  /** Environment mode (development, production, test) */
  readonly MODE: string;
  /** Whether the build is running in development mode */
  readonly DEV: boolean;
  /** Whether the build is running in production mode */
  readonly PROD: boolean;
  /** Base public path for assets */
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
