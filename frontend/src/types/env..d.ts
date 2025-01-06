/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string; // Add more environment variables here as needed
  // readonly VITE_ANOTHER_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
