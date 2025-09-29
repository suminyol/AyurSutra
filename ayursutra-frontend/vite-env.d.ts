/// <reference types="vite/client" />

// If you want to add custom environment variables:
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
