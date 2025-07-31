// global.d.ts

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_UNSPLASH_ACCESS_KEY: string
  readonly VITE_PEXELS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
