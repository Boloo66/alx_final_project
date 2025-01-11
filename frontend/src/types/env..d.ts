/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string;
  readonly VITE_STRIPE_PKEY: string;
  // readonly VITE_ANOTHER_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
