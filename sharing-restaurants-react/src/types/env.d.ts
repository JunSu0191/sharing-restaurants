interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_OTHER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
