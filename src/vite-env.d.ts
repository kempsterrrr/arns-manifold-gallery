/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_ARNS_NAME: string
  readonly VITE_DEPLOY_KEY: string
  readonly VITE_RPC_URL: string
  readonly VITE_CHAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
